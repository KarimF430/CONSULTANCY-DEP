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

    // Calendly URL - replace with your actual Calendly link
    const CALENDLY_URL = 'https://calendly.com/carconsultancy/consultation';

    // Get booking info from session storage or URL params
    useEffect(() => {
        const storedBooking = sessionStorage.getItem('lastBooking');
        if (storedBooking) {
            const parsed = JSON.parse(storedBooking);
            if (searchParams.get('txnid')) {
                parsed.orderId = searchParams.get('txnid');
            }
            setBooking(parsed);
            sessionStorage.removeItem('lastBooking');
        }

        if (!hasCleared.current) {
            hasCleared.current = true;
            clearCart();
        }
    }, [searchParams]);

    const handleBookSlot = () => {
        // Open Calendly with prefilled user info
        let calendlyUrl = CALENDLY_URL;
        if (booking) {
            const params = new URLSearchParams();
            if (booking.name) params.append('name', booking.name);
            if (booking.email) params.append('email', booking.email);
            calendlyUrl += `?${params.toString()}`;
        }
        window.open(calendlyUrl, '_blank');
    };

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
                            {booking.amount && (
                                <div className={styles.orderRow}>
                                    <span className={styles.orderLabel}>Amount Paid</span>
                                    <span className={styles.orderAmount}>₹{booking.amount}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Calendly Booking Section - Important! */}
                <div className={styles.calendlySection}>
                    <div className={styles.calendlyHeader}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <h3>Book Your Consultation Slot</h3>
                    </div>
                    <p className={styles.calendlyDesc}>
                        Click below to choose a convenient time for your expert consultation call.
                    </p>
                    <button onClick={handleBookSlot} className={styles.calendlyBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Book on Calendly
                    </button>
                </div>

                {/* Next Steps */}
                <div className={styles.nextSteps}>
                    <h3 className={styles.stepsTitle}>What happens next?</h3>
                    <ul className={styles.stepsList}>
                        <li>
                            <span className={styles.stepNumber}>1</span>
                            <span>Book your preferred slot using the button above</span>
                        </li>
                        <li>
                            <span className={styles.stepNumber}>2</span>
                            <span>You&apos;ll receive a calendar invite via email</span>
                        </li>
                        <li>
                            <span className={styles.stepNumber}>3</span>
                            <span>Our expert will call you at your scheduled time</span>
                        </li>
                    </ul>
                </div>

                {/* Support */}
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
