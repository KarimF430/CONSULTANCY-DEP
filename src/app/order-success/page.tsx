'use client';

import Link from 'next/link';
import styles from './success.module.css';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';

interface BookingInfo {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    planName: string;
    schedulingUrl: string;
}

export default function OrderSuccessPage() {
    const { cartItems, getTotal, clearCart } = useCart();
    const [booking, setBooking] = useState<BookingInfo | null>(null);

    // Generate order ID
    const orderId = `CAR${Date.now().toString().slice(-8)}`;

    // Get booking info from session storage
    useEffect(() => {
        const storedBooking = sessionStorage.getItem('lastBooking');
        if (storedBooking) {
            setBooking(JSON.parse(storedBooking));
        }
        // Clear cart after successful order
        clearCart();
    }, [clearCart]);

    const handleConfirmSlot = () => {
        if (booking?.schedulingUrl) {
            window.open(booking.schedulingUrl, '_blank');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Success Animation */}
                <div className={styles.successIcon}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>

                <h1 className={styles.title}>Payment Successful! 🎉</h1>
                <p className={styles.subtitle}>Thank you for choosing Car Consultancy</p>

                {/* Order Details */}
                <div className={styles.orderDetails}>
                    <div className={styles.orderRow}>
                        <span className={styles.orderLabel}>Order ID</span>
                        <span className={styles.orderId}>{orderId}</span>
                    </div>
                    {booking && (
                        <>
                            <div className={styles.orderRow}>
                                <span className={styles.orderLabel}>Plan</span>
                                <span className={styles.orderValue}>{booking.planName}</span>
                            </div>
                            <div className={styles.orderRow}>
                                <span className={styles.orderLabel}>Selected Slot</span>
                                <span className={styles.orderValue}>{booking.date} at {booking.time}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Confirm Calendly Slot */}
                {booking?.schedulingUrl && (
                    <div className={styles.calendlySection}>
                        <h3 className={styles.calendlyTitle}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            Confirm Your Appointment
                        </h3>
                        <p className={styles.calendlyDesc}>
                            Click the button below to confirm your slot on our calendar. This ensures your time is reserved.
                        </p>
                        <button onClick={handleConfirmSlot} className={styles.calendlyBtn}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            Confirm on Calendly
                        </button>
                    </div>
                )}

                {/* Next Steps */}
                <div className={styles.nextSteps}>
                    <h3 className={styles.stepsTitle}>What happens next?</h3>
                    <ul className={styles.stepsList}>
                        <li>
                            <span className={styles.stepNumber}>1</span>
                            <span>Confirm your slot by clicking the button above</span>
                        </li>
                        <li>
                            <span className={styles.stepNumber}>2</span>
                            <span>You'll receive a calendar invite and confirmation email</span>
                        </li>
                        <li>
                            <span className={styles.stepNumber}>3</span>
                            <span>Our expert will call you at your scheduled time</span>
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <Link href="/" className={styles.homeBtn}>
                        Back to Home
                    </Link>
                    <Link href="/plans" className={styles.plansBtn}>
                        View Other Plans
                    </Link>
                </div>
            </div>
        </div>
    );
}
