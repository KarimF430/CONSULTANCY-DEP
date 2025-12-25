import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    planId: number;
    planName: string;
    planPrice: number;
    slotDate: string;      // YYYY-MM-DD
    slotTime: string;      // 09:00 AM
    status: 'pending' | 'confirmed' | 'cancelled';
    paymentMethod: string;
    calendlyConfirmed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        customerEmail: {
            type: String,
            required: true,
        },
        customerPhone: {
            type: String,
            required: true,
        },
        planId: {
            type: Number,
            required: true,
        },
        planName: {
            type: String,
            required: true,
        },
        planPrice: {
            type: Number,
            required: true,
        },
        slotDate: {
            type: String,
            required: true,
            index: true,
        },
        slotTime: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'confirmed',
            index: true,
        },
        paymentMethod: {
            type: String,
            default: 'upi',
        },
        calendlyConfirmed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for checking slot availability
BookingSchema.index({ slotDate: 1, slotTime: 1, status: 1 });

// Prevent duplicate bookings for same slot
BookingSchema.index(
    { slotDate: 1, slotTime: 1 },
    {
        unique: true,
        partialFilterExpression: { status: { $ne: 'cancelled' } }
    }
);

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
