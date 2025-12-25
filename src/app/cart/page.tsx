'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './cart.module.css';
import { useCart } from '@/context/CartContext';
import ExitIntentModal from '@/components/ExitIntentModal';

export default function CartPage() {
    const router = useRouter();
    const { selectedPlan, couponCode, discount, applyCoupon, clearCoupon, getTotal, removeFromCart } = useCart();
    const [couponInput, setCouponInput] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState(false);

    // Exit Intent
    const [showExitModal, setShowExitModal] = useState(false);
    const hasInitializedHistory = useRef(false);
    const isLeavingIntentionally = useRef(false);

    // Initialize history state
    useEffect(() => {
        if (!hasInitializedHistory.current && typeof window !== 'undefined') {
            window.history.pushState({ page: 'cart' }, '');
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
            window.history.pushState({ page: 'cart' }, '');
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
        router.push('/plans');
    };

    const handleApplyCoupon = () => {
        setCouponError('');
        setCouponSuccess(false);
        if (applyCoupon(couponInput)) {
            setCouponSuccess(true);
            setCouponInput('');
        } else {
            setCouponError('Invalid coupon code');
        }
    };

    const handleRemoveCoupon = () => {
        clearCoupon();
        setCouponSuccess(false);
    };

    // Redirect to plans if no plan selected
    if (!selectedPlan) {
        return (
            <div className={styles.emptyCart}>
                <div className={styles.emptyIcon}>🛒</div>
                <h2>Your cart is empty</h2>
                <p>Select a plan to get started with your car buying journey.</p>
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
                    <h1 className={styles.title}>Your Cart</h1>
                </div>

                {/* Savings Banner */}
                {discount > 0 && (
                    <div className={styles.savingsBanner}>
                        <span className={styles.savingsIcon}>🎉</span>
                        <span>Yay! You <strong>saved ₹{discount}</strong> on this order</span>
                    </div>
                )}

                {/* Plan Card */}
                <div className={styles.planCard}>
                    <div className={styles.planHeader}>
                        <div className={styles.planIcon}>
                            {selectedPlan.icon || '📋'}
                        </div>
                        <div className={styles.planInfo}>
                            <h3 className={styles.planTitle}>{selectedPlan.title}</h3>
                            <p className={styles.planDetail}>{selectedPlan.detail}</p>
                        </div>
                        <div className={styles.planPrice}>
                            <span className={styles.currency}>₹</span>
                            {selectedPlan.price}
                        </div>
                    </div>
                    <p className={styles.planDesc}>{selectedPlan.description}</p>
                    <button onClick={removeFromCart} className={styles.removeBtn}>
                        Remove
                    </button>
                </div>

                {/* Add More Plans */}
                <div className={styles.addMoreSection}>
                    <span className={styles.addMoreText}>Missed something?</span>
                    <Link href="/plans" className={styles.addMoreBtn}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add More Plans
                    </Link>
                </div>

                {/* Coupon Section */}
                <div className={styles.couponSection}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.couponIcon}>🏷️</span>
                        Apply Coupon
                    </h3>

                    {couponCode ? (
                        <div className={styles.appliedCoupon}>
                            <div className={styles.appliedCouponInfo}>
                                <span className={styles.couponBadge}>{couponCode}</span>
                                <span className={styles.couponSaving}>₹{discount} OFF</span>
                            </div>
                            <button onClick={handleRemoveCoupon} className={styles.removeCouponBtn}>
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div className={styles.couponInputWrapper}>
                            <input
                                type="text"
                                placeholder="Enter coupon code"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                className={styles.couponInput}
                            />
                            <button onClick={handleApplyCoupon} className={styles.applyBtn}>
                                Apply
                            </button>
                        </div>
                    )}

                    {couponError && <p className={styles.couponError}>{couponError}</p>}
                    {couponSuccess && <p className={styles.couponSuccessMsg}>Coupon applied successfully!</p>}

                    <div className={styles.availableCoupons}>
                        <p className={styles.availableTitle}>Available Coupons:</p>
                        <div className={styles.couponList}>
                            <button onClick={() => setCouponInput('SAVE10')} className={styles.couponTag}>SAVE10</button>
                            <button onClick={() => setCouponInput('EXPERT20')} className={styles.couponTag}>EXPERT20</button>
                            <button onClick={() => setCouponInput('FIRST50')} className={styles.couponTag}>FIRST50</button>
                        </div>
                    </div>
                </div>

                {/* Bill Summary */}
                <div className={styles.billSummary}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.billIcon}>📋</span>
                        Bill Summary
                    </h3>

                    <div className={styles.billRow}>
                        <span>Item Total</span>
                        <span>₹{selectedPlan.price}</span>
                    </div>

                    {discount > 0 && (
                        <div className={`${styles.billRow} ${styles.discountRow}`}>
                            <span>Coupon Discount</span>
                            <span className={styles.discountAmount}>-₹{discount}</span>
                        </div>
                    )}

                    <div className={styles.billDivider}></div>

                    <div className={`${styles.billRow} ${styles.totalRow}`}>
                        <span>To Pay</span>
                        <span className={styles.totalAmount}>₹{getTotal()}</span>
                    </div>
                </div>

                {/* Proceed Button */}
                <div className={styles.stickyFooter}>
                    <Link href="/checkout" className={styles.proceedBtn}>
                        Proceed to Checkout
                        <span className={styles.proceedAmount}>₹{getTotal()}</span>
                    </Link>
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
