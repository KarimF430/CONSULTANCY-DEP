'use client';

import { useState } from 'react';
import styles from './AddMoreModal.module.css';
import { useCart } from '@/context/CartContext';

interface Plan {
    id: number;
    title: string;
    price: number;
    description: string;
    detail: string;
    icon: string;
    type: string;
    badge?: string;
}

const allPlans: Plan[] = [
    {
        id: 1,
        title: 'WhatsApp Consultation',
        price: 499,
        detail: '1 message within 2 working days',
        description: 'Get personalized car recommendations via WhatsApp. Send us your requirements, and we\'ll analyze them to suggest the perfect vehicle—fast, reliable, and tailored just for you.',
        icon: '💬',
        type: 'basic',
    },
    {
        id: 2,
        title: 'Call with an Auto-Expert',
        price: 699,
        detail: '15-min call within 48 working hrs',
        description: 'Connect one-on-one with our experts to discuss your needs, daily usage, and preferences—so you can choose the perfect car with complete confidence.',
        icon: '📞',
        type: 'preferred',
        badge: 'Most Popular',
    },
    {
        id: 3,
        title: 'Urgent Expert Call',
        price: 999,
        detail: 'Priority 15-min call within 4 hours',
        description: 'Need help fast? Get connected with an expert within 4 hours for urgent car buying decisions. Perfect for time-sensitive purchases.',
        icon: '⚡',
        type: 'hurry',
        badge: 'Quick Response',
    },
];

interface AddMoreModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddMoreModal({ isOpen, onClose }: AddMoreModalProps) {
    const { cartItems, addToCart, removeFromCart } = useCart();

    if (!isOpen) return null;

    const isInCart = (planId: number) => {
        return cartItems.some(item => item.id === planId);
    };

    const handleToggle = (plan: Plan) => {
        if (isInCart(plan.id)) {
            removeFromCart(plan.id);
        } else {
            addToCart(plan);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Add More Plans</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Summary */}
                <div className={styles.cartSummary}>
                    <span className={styles.cartIcon}>🛒</span>
                    <span className={styles.cartText}>
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
                    </span>
                </div>

                {/* Plans List */}
                <div className={styles.plansList}>
                    {allPlans.map((plan) => {
                        const inCart = isInCart(plan.id);
                        return (
                            <div
                                key={plan.id}
                                className={`${styles.planCard} ${inCart ? styles.planCardAdded : ''}`}
                            >
                                {plan.badge && (
                                    <span className={`${styles.badge} ${plan.type === 'hurry' ? styles.badgeHurry : ''}`}>
                                        {plan.badge}
                                    </span>
                                )}

                                <div className={styles.planHeader}>
                                    <span className={styles.planIcon}>{plan.icon}</span>
                                    <div className={styles.planInfo}>
                                        <h3 className={styles.planTitle}>{plan.title}</h3>
                                        <p className={styles.planDetail}>{plan.detail}</p>
                                    </div>
                                    <span className={styles.planPrice}>₹{plan.price}</span>
                                </div>

                                <p className={styles.planDesc}>{plan.description}</p>

                                <button
                                    onClick={() => handleToggle(plan)}
                                    className={`${styles.actionBtn} ${inCart ? styles.removeBtn : styles.addBtn}`}
                                >
                                    {inCart ? (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Added
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 5v14M5 12h14" />
                                            </svg>
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Done Button */}
                <div className={styles.footer}>
                    <button onClick={onClose} className={styles.doneBtn}>
                        Done
                        <span className={styles.doneAmount}>
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} • ₹{cartItems.reduce((sum, item) => sum + item.price, 0)}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
