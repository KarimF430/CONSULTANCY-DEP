import { NextRequest, NextResponse } from 'next/server';

const CALENDLY_API_BASE = 'https://api.calendly.com';

export async function POST(request: NextRequest) {
    const token = process.env.CALENDLY_API_TOKEN;

    if (!token) {
        return NextResponse.json({ error: 'Calendly token not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { name, email, phone, date, time, planName } = body;

        if (!name || !email || !date || !time) {
            return NextResponse.json({
                error: 'Missing required fields: name, email, date, time'
            }, { status: 400 });
        }

        // Get user info
        const userResponse = await fetch(`${CALENDLY_API_BASE}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!userResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch user info' }, { status: userResponse.status });
        }

        const userData = await userResponse.json();
        const userUri = userData.resource.uri;

        // Get event types
        const eventsResponse = await fetch(`${CALENDLY_API_BASE}/event_types?user=${encodeURIComponent(userUri)}&active=true`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!eventsResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch event types' }, { status: eventsResponse.status });
        }

        const eventsData = await eventsResponse.json();

        if (eventsData.collection.length === 0) {
            return NextResponse.json({ error: 'No active event types found' }, { status: 404 });
        }

        const eventType = eventsData.collection[0];

        // Parse the selected time into ISO format
        const [timeStr, period] = time.split(' ');
        const [hours, minutes] = timeStr.split(':').map(Number);
        let hour24 = hours;
        if (period === 'PM' && hours !== 12) hour24 += 12;
        if (period === 'AM' && hours === 12) hour24 = 0;

        const startDateTime = new Date(date);
        startDateTime.setHours(hour24, minutes, 0, 0);

        // NOTE: Calendly's API doesn't have a direct "create scheduled event" endpoint
        // for invitees. The proper flow is:
        // 1. User selects slot
        // 2. Redirect to Calendly's scheduling page with prefilled data
        // OR use Calendly's Embed/Widget

        // For now, we return the scheduling URL with prefilled data
        const schedulingUrl = new URL(eventType.scheduling_url);
        schedulingUrl.searchParams.set('name', name);
        schedulingUrl.searchParams.set('email', email);
        if (phone) {
            schedulingUrl.searchParams.set('a1', phone); // Custom field for phone
        }
        // Prefill the selected time
        schedulingUrl.searchParams.set('date', date);
        schedulingUrl.searchParams.set('month', date.substring(0, 7));

        return NextResponse.json({
            success: true,
            message: 'Booking prepared',
            schedulingUrl: schedulingUrl.toString(),
            eventType: {
                name: eventType.name,
                duration: eventType.duration,
            },
            booking: {
                name,
                email,
                phone,
                date,
                time,
                planName,
                startDateTime: startDateTime.toISOString(),
            }
        });
    } catch (error) {
        console.error('Calendly booking error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
