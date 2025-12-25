'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './checkout.module.css';
import { useCart } from '@/context/CartContext';
import ExitIntentModal from '@/components/ExitIntentModal';

export default function CheckoutPage() {
    const router = useRouter();
    const { selectedPlan, discount, getTotal } = useCart();

    // Form State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [isProcessing, setIsProcessing] = useState(false);

    // Exit Intent
    const [showExitModal, setShowExitModal] = useState(false);
    const hasInitializedHistory = useRef(false);
    const isLeavingIntentionally = useRef(false);

    // Initialize history state
    useEffect(() => {
        if (!hasInitializedHistory.current && typeof window !== 'undefined') {
            window.history.pushState({ page: 'checkout' }, '');
            hasInitializedHistory.current = true;
        }
    }, []);

    // Handle back button
    useEffect(() => {
        const handlePopState = () => {
            if (isLeavingIntentionally.current) {
                isLeavingIntentionally.current = false;
                return;
            }
            setShowExitModal(true);
            window.history.pushState({ page: 'checkout' }, '');
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleExitStay = () => {
        setShowExitModal(false);
    };

    const handleExitLeave = () => {
        setShowExitModal(false);
        isLeavingIntentionally.current = true;
        router.push('/cart');
    };

    const timeSlots = [
        { id: '1', label: 'Morning (9 AM - 12 PM)', value: 'morning' },
        { id: '2', label: 'Afternoon (12 PM - 4 PM)', value: 'afternoon' },
        { id: '3', label: 'Evening (4 PM - 8 PM)', value: 'evening' },
    ];

    const paymentMethods = [
        { id: 'upi', label: 'UPI', icon: '📱', subLabel: 'GPay, PhonePe, Paytm' },
        { id: 'card', label: 'Credit / Debit Card', icon: '💳', subLabel: 'Visa, Mastercard, Rupay' },
        { id: 'netbanking', label: 'Net Banking', icon: '🏦', subLabel: 'All major banks' },
    ];

    const handlePayment = async () => {
        if (!name || !phone || !email || !timeSlot) {
            alert('Please fill all required fields');
            return;
        }

        setIsProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // For demo, randomly succeed or fail
        const success = Math.random() > 0.3;

        if (success) {
            router.push('/order-success');
        } else {
            router.push('/order-failed');
        }
    };

    // Redirect to cart if no plan selected
    if (!selectedPlan) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🛒</div>
                <h2>No plan selected</h2>
                <p>Please select a plan first to proceed with checkout.</p>
                <Link href="/plans" className={styles.browseBtn}>
                    Browse Plans
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <button onClick={() => setShowExitModal(true)} className={styles.backBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className={styles.title}>Checkout</h1>
                </div>

                {/* Order Summary */}
                <div className={styles.orderSummary}>
                    <div className={styles.summaryHeader}>
                        <h3>Order Summary</h3>
                        <Link href="/cart" className={styles.editLink}>Edit</Link>
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.planName}>{selectedPlan.title}</span>
                        <span className={styles.planAmount}>
                            {discount > 0 && <del className={styles.originalPrice}>₹{selectedPlan.price}</del>}
                            ₹{getTotal()}
                        </span>
                    </div>
                </div>

                {/* Contact Details */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>👤</span>
                        Contact Details
                    </h3>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Full Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Phone Number *</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            className={styles.input}
                        />
                    </div>
                </div>

                {/* Time Slot */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>⏰</span>
                        Preferred Call Time
                    </h3>

                    <div className={styles.timeSlots}>
                        {timeSlots.map((slot) => (
                            <button
                                key={slot.id}
                                onClick={() => setTimeSlot(slot.value)}
                                className={`${styles.timeSlotBtn} ${timeSlot === slot.value ? styles.timeSlotActive : ''}`}
                            >
                                {slot.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payment Methods */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>💰</span>
                        Payment Method
                    </h3>

                    <div className={styles.paymentMethods}>
                        {paymentMethods.map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={`${styles.paymentBtn} ${paymentMethod === method.id ? styles.paymentActive : ''}`}
                            >
                                <span className={styles.paymentIcon}>{method.icon}</span>
                                <div className={styles.paymentInfo}>
                                    <span className={styles.paymentLabel}>{method.label}</span>
                                    <span className={styles.paymentSub}>{method.subLabel}</span>
                                </div>
                                <div className={styles.paymentRadio}>
                                    {paymentMethod === method.id && <div className={styles.radioInner}></div>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pay Button */}
                <div className={styles.stickyFooter}>
                    <button
                        onClick={handlePayment}
                        className={styles.payBtn}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <span className={styles.spinner}></span>
                                Processing...
                            </>
                        ) : (
                            <>
                                Pay ₹{getTotal()}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <ExitIntentModal
                isOpen={showExitModal}
                onStay={handleExitStay}
                onLeave={handleExitLeave}
                isExpertView={false}
            />
        </>
    );
}
