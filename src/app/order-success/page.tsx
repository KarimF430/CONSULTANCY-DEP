'use client';

import Link from 'next/link';
import styles from './success.module.css';
import { useCart } from '@/context/CartContext';
import { useEffect } from 'react';

export default function OrderSuccessPage() {
    const { selectedPlan, removeFromCart, getTotal } = useCart();

    // Generate order ID
    const orderId = `CAR${Date.now().toString().slice(-8)}`;

    // Clear cart after successful order (optional: can keep for reference)
    useEffect(() => {
        // Clear pending booking from localStorage
        localStorage.removeItem('pendingBooking');
    }, []);

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
                    {selectedPlan && (
                        <>
                            <div className={styles.orderRow}>
                                <span className={styles.orderLabel}>Plan</span>
                                <span className={styles.orderValue}>{selectedPlan.title}</span>
                            </div>
                            <div className={styles.orderRow}>
                                <span className={styles.orderLabel}>Amount Paid</span>
                                <span className={styles.orderAmount}>₹{getTotal()}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Next Steps */}
                <div className={styles.nextSteps}>
                    <h3 className={styles.stepsTitle}>What happens next?</h3>
                    <ul className={styles.stepsList}>
                        <li>
                            <span className={styles.stepNumber}>1</span>
                            <span>You'll receive a confirmation email shortly</span>
                        </li>
                        <li>
                            <span className={styles.stepNumber}>2</span>
                            <span>Our expert will call you within your preferred time slot</span>
                        </li>
                        <li>
                            <span className={styles.stepNumber}>3</span>
                            <span>Get personalized car buying advice tailored to your needs</span>
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
