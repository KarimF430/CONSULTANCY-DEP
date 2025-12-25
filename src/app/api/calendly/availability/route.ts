import { NextRequest, NextResponse } from 'next/server';

const CALENDLY_API_BASE = 'https://api.calendly.com';

export async function GET(request: NextRequest) {
    const token = process.env.CALENDLY_API_TOKEN;

    if (!token) {
        return NextResponse.json({ error: 'Calendly token not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    if (!startDate || !endDate) {
        return NextResponse.json({ error: 'start_date and end_date are required' }, { status: 400 });
    }

    try {
        // Get current user info
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

        // Get the first active event type (you can modify to select specific one)
        const eventType = eventsData.collection[0];
        const eventTypeUri = eventType.uri;

        // Fetch available times
        const availabilityResponse = await fetch(
            `${CALENDLY_API_BASE}/event_type_available_times?event_type=${encodeURIComponent(eventTypeUri)}&start_time=${startDate}T00:00:00Z&end_time=${endDate}T23:59:59Z`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!availabilityResponse.ok) {
            const error = await availabilityResponse.text();
            return NextResponse.json({ error: 'Failed to fetch availability', details: error }, { status: availabilityResponse.status });
        }

        const availabilityData = await availabilityResponse.json();

        // Get scheduled events (booked slots)
        const scheduledResponse = await fetch(
            `${CALENDLY_API_BASE}/scheduled_events?user=${encodeURIComponent(userUri)}&min_start_time=${startDate}T00:00:00Z&max_start_time=${endDate}T23:59:59Z&status=active`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        let bookedSlots: string[] = [];
        if (scheduledResponse.ok) {
            const scheduledData = await scheduledResponse.json();
            bookedSlots = scheduledData.collection.map((event: any) => event.start_time);
        }

        // Format available times by date
        const slotsByDate: { [date: string]: { time: string; available: boolean }[] } = {};

        availabilityData.collection.forEach((slot: any) => {
            const startTime = new Date(slot.start_time);
            const dateKey = startTime.toISOString().split('T')[0];
            const timeStr = startTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            });

            if (!slotsByDate[dateKey]) {
                slotsByDate[dateKey] = [];
            }

            slotsByDate[dateKey].push({
                time: timeStr,
                available: slot.status === 'available',
            });
        });

        return NextResponse.json({
            success: true,
            eventType: {
                name: eventType.name,
                duration: eventType.duration,
                schedulingUrl: eventType.scheduling_url,
            },
            timezone: userData.resource.timezone,
            availability: slotsByDate,
            bookedSlots,
        });
    } catch (error) {
        console.error('Calendly availability error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
