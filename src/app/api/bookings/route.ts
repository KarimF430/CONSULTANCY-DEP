import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

// POST - Create a new booking
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { name, email, phone, planId, planName, planPrice, slotDate, slotTime, paymentMethod } = body;

        // Validate required fields
        if (!name || !email || !phone || !slotDate || !slotTime || !planName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if slot is already booked
        const existingBooking = await Booking.findOne({
            slotDate,
            slotTime,
            status: { $ne: 'cancelled' },
        });

        if (existingBooking) {
            return NextResponse.json(
                { error: 'This slot is already booked', slotTaken: true },
                { status: 409 }
            );
        }

        // Generate order ID
        const orderId = `CAR${Date.now().toString().slice(-8)}`;

        // Create booking
        const booking = await Booking.create({
            orderId,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            planId: planId || 1,
            planName,
            planPrice: planPrice || 0,
            slotDate,
            slotTime,
            status: 'confirmed',
            paymentMethod: paymentMethod || 'upi',
            calendlyConfirmed: false,
        });

        return NextResponse.json({
            success: true,
            orderId: booking.orderId,
            booking: {
                id: booking._id,
                orderId: booking.orderId,
                name: booking.customerName,
                email: booking.customerEmail,
                slotDate: booking.slotDate,
                slotTime: booking.slotTime,
                planName: booking.planName,
                status: booking.status,
            },
        });
    } catch (error: any) {
        console.error('Booking creation error:', error);

        // Handle duplicate key error (slot already booked)
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'This slot is already booked', slotTaken: true },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        );
    }
}

// GET - Get all bookings (admin)
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const query: any = {};
        if (status) {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json({
            success: true,
            count: bookings.length,
            bookings: bookings.map(b => ({
                orderId: b.orderId,
                customerName: b.customerName,
                customerEmail: b.customerEmail,
                slotDate: b.slotDate,
                slotTime: b.slotTime,
                planName: b.planName,
                status: b.status,
                createdAt: b.createdAt,
            })),
        });
    } catch (error) {
        console.error('Fetch bookings error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}
