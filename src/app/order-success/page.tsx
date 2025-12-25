'use client';

import Link from 'next/link';
import styles from './success.module.css';
import { useCart } from '@/context/CartContext';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

interface BookingInfo {
    orderId?: string;
    name: string;
    email: string;
    phone?: string;
    planName: string;
    amount?: number;
}

export default function OrderSuccessPage() {
    const { clearCart } = useCart();
    const [booking, setBooking] = useState<BookingInfo | null>(null);
    const hasCleared = useRef(false);
    const searchParams = useSearchParams();

    // Get booking info from session storage or URL params
    useEffect(() => {
        const storedBooking = sessionStorage.getItem('lastBooking');
        if (storedBooking) {
            const parsed = JSON.parse(storedBooking);
            // Override with URL params if available (from PayU callback)
            if (searchParams.get('txnid')) {
                parsed.orderId = searchParams.get('txnid');
            }
            setBooking(parsed);
            sessionStorage.removeItem('lastBooking'); // Clean up
        }

        // Clear cart after successful order (only once)
        if (!hasCleared.current) {
            hasCleared.current = true;
            clearCart();
        }
    }, [searchParams]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Success Animation */}
                <div className={styles.successIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>

                <h1 className={styles.title}>Payment Successful! 🎉</h1>
                <p className={styles.subtitle}>Thank you for choosing Car Consultancy</p>

                {/* Order Details */}
                <div className={styles.orderDetails}>
                    {booking?.orderId && (
                        <div className={styles.orderRow}>
                            <span className={styles.orderLabel}>Order ID</span>
                            <span className={styles.orderId}>{booking.orderId}</span>
                        </div>
                    )}
                    {booking && (
                        <>
                            <div className={styles.orderRow}>
                                <span className={styles.orderLabel}>Plan</span>
                                <span className={styles.orderValue}>{booking.planName}</span>
                            </div>
                            <div className={styles.orderRow}>
                                <span className={styles.orderLabel}>Name</span>
                                <span className={styles.orderValue}>{booking.name}</span>
                            </div>
                            <div className={styles.orderRow}>
                                <span className={styles.orderLabel}>Email</span>
                                <span className={styles.orderValue}>{booking.email}</span>
                            </div>
                            {booking.amount && (
                                <div className={styles.orderRow}>
                                    <span className={styles.orderLabel}>Amount Paid</span>
                                    <span className={styles.orderAmount}>₹{booking.amount}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* What's Next */}
                <div className={styles.nextSteps}>
                    <h3 className={styles.stepsTitle}>What happens next?</h3>
                    <ul className={styles.stepsList}>
                        <li>
                            <span className={styles.stepNumber}>1</span>
                            <span>You&apos;ll receive a confirmation email shortly</span>
                        </li>
                        <li>
                            <span className={styles.stepNumber}>2</span>
                            <span>Our expert will contact you within 24 hours</span>
                        </li>
                        <li>
                            <span className={styles.stepNumber}>3</span>
                            <span>Get personalized car buying advice!</span>
                        </li>
                    </ul>
                </div>

                {/* Contact Support */}
                <div className={styles.supportBox}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>Questions? Call us at <strong>+91 98765 43210</strong></span>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <Link href="/" className={styles.homeBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
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
