import { NextResponse } from 'next/server';

const CALENDLY_API_BASE = 'https://api.calendly.com';

export async function GET() {
    const token = process.env.CALENDLY_API_TOKEN;

    if (!token) {
        return NextResponse.json({ error: 'Calendly token not configured' }, { status: 500 });
    }

    try {
        // Get current user info to get user URI
        const userResponse = await fetch(`${CALENDLY_API_BASE}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!userResponse.ok) {
            const error = await userResponse.text();
            return NextResponse.json({ error: 'Failed to fetch user info', details: error }, { status: userResponse.status });
        }

        const userData = await userResponse.json();
        const userUri = userData.resource.uri;

        // Get event types
        const eventsResponse = await fetch(`${CALENDLY_API_BASE}/event_types?user=${encodeURIComponent(userUri)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!eventsResponse.ok) {
            const error = await eventsResponse.text();
            return NextResponse.json({ error: 'Failed to fetch event types', details: error }, { status: eventsResponse.status });
        }

        const eventsData = await eventsResponse.json();

        return NextResponse.json({
            success: true,
            user: {
                name: userData.resource.name,
                email: userData.resource.email,
                timezone: userData.resource.timezone,
                uri: userUri,
            },
            eventTypes: eventsData.collection.map((event: any) => ({
                uri: event.uri,
                name: event.name,
                duration: event.duration,
                slug: event.slug,
                schedulingUrl: event.scheduling_url,
                active: event.active,
            })),
        });
    } catch (error) {
        console.error('Calendly API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
