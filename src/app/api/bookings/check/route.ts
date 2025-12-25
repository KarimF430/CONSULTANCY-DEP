import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

// GET - Check booked slots for date range
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: 'start_date and end_date are required' },
                { status: 400 }
            );
        }

        // Find all confirmed bookings in date range
        const bookings = await Booking.find({
            slotDate: { $gte: startDate, $lte: endDate },
            status: { $ne: 'cancelled' },
        }).select('slotDate slotTime');

        // Format as "YYYY-MM-DD|HH:MM AM" for easy lookup
        const bookedSlots = bookings.map(b => `${b.slotDate}|${b.slotTime}`);

        // Also group by date for slot counts
        const bookedByDate: { [date: string]: string[] } = {};
        bookings.forEach(b => {
            if (!bookedByDate[b.slotDate]) {
                bookedByDate[b.slotDate] = [];
            }
            bookedByDate[b.slotDate].push(b.slotTime);
        });

        return NextResponse.json({
            success: true,
            bookedSlots,
            bookedByDate,
        });
    } catch (error) {
        console.error('Check booked slots error:', error);
        return NextResponse.json(
            { error: 'Failed to check booked slots' },
            { status: 500 }
        );
    }
}
