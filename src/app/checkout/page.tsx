'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './checkout.module.css';
import { useCart } from '@/context/CartContext';
import ExitIntentModal from '@/components/ExitIntentModal';
import SlotPicker from '@/components/SlotPicker';

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, discount, getSubtotal, getTotal, userInfo, setUserInfo } = useCart();

    // Form State - Auto-fill from userInfo if available
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Auto-fill from cart userInfo
    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name || '');
            setPhone(userInfo.phone || '');
            setEmail(userInfo.email || '');
        }
    }, [userInfo]);

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

    const paymentMethods = [
        {
            id: 'upi',
            label: 'UPI',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
            ),
            subLabel: 'GPay, PhonePe, Paytm'
        },
        {
            id: 'card',
            label: 'Credit / Debit Card',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                </svg>
            ),
            subLabel: 'Visa, Mastercard, Rupay'
        },
        {
            id: 'netbanking',
            label: 'Net Banking',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18" /><path d="M3 10h18" /><path d="M5 6l7-3 7 3" /><path d="M4 10v11" /><path d="M20 10v11" /><path d="M8 14v3" /><path d="M12 14v3" /><path d="M16 14v3" />
                </svg>
            ),
            subLabel: 'All major banks'
        },
    ];

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!name.trim()) newErrors.name = 'Name is required';
        if (!phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) newErrors.phone = 'Enter valid 10-digit number';
        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter valid email';
        if (!selectedSlot) newErrors.slot = 'Please select a time slot';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async () => {
        if (!validateForm()) return;

        // Save user info for future use
        setUserInfo({ name, phone, email });

        setIsProcessing(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // For demo, randomly succeed or fail (80% success rate)
            const paymentSuccess = Math.random() > 0.2;

            if (!paymentSuccess) {
                router.push('/order-failed');
                return;
            }

            // Payment successful - Get Calendly scheduling URL
            const calendlyResponse = await fetch('/api/calendly/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    date: selectedSlot?.date,
                    time: selectedSlot?.time,
                    planName: cartItems[0]?.title || 'Consultation',
                }),
            });

            let schedulingUrl = '';
            const orderId = `CAR${Date.now().toString().slice(-8)}`;

            if (calendlyResponse.ok) {
                const calendlyData = await calendlyResponse.json();
                schedulingUrl = calendlyData.schedulingUrl || '';
            }

            // Store booking info for success page
            sessionStorage.setItem('lastBooking', JSON.stringify({
                orderId,
                name,
                email,
                date: selectedSlot?.date,
                time: selectedSlot?.time,
                planName: cartItems[0]?.title || 'Consultation',
                schedulingUrl,
            }));

            router.push('/order-success');
        } catch (error) {
            console.error('Payment/booking error:', error);
            router.push('/order-failed');
        } finally {
            setIsProcessing(false);
        }
    };

    // Redirect to cart if no items
    if (cartItems.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🛒</div>
                <h2>No items in cart</h2>
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
                        <span className={styles.summaryLabel}>Order Summary</span>
                        <Link href="/cart" className={styles.editLink}>Edit</Link>
                    </div>
                    {cartItems.map((plan) => (
                        <div key={plan.id} className={styles.summaryContent}>
                            <span className={styles.planName}>{plan.title}</span>
                            <span className={styles.planAmount}>₹{plan.price}</span>
                        </div>
                    ))}
                    {discount > 0 && (
                        <div className={styles.summaryContent}>
                            <span className={styles.discountLabel}>Discount</span>
                            <span className={styles.discountValue}>-₹{discount}</span>
                        </div>
                    )}
                    <div className={styles.summaryTotal}>
                        <span>Total</span>
                        <span>₹{getTotal()}</span>
                    </div>
                </div>

                {/* Contact Details */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        Contact Details
                    </h3>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Full Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                        />
                        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Phone Number *</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                            className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                        />
                        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>
                </div>

                {/* Slot Picker */}
                <div className={styles.slotSection}>
                    <SlotPicker
                        selectedSlot={selectedSlot}
                        onSelectSlot={setSelectedSlot}
                    />
                    {errors.slot && <span className={styles.errorText}>{errors.slot}</span>}
                </div>

                {/* Payment Methods */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
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
                    <div className={styles.footerInfo}>
                        {selectedSlot && (
                            <span className={styles.selectedSlotInfo}>
                                📅 {new Date(selectedSlot.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} at {selectedSlot.time}
                            </span>
                        )}
                    </div>
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
