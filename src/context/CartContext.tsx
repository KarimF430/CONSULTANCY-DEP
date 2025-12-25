'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Plan {
    id: number;
    title: string;
    price: number;
    description: string;
    detail: string;
    icon?: ReactNode;
    type: string;
    badge?: string;
}

interface CartContextType {
    selectedPlan: Plan | null;
    couponCode: string;
    discount: number;
    addToCart: (plan: Plan) => void;
    removeFromCart: () => void;
    applyCoupon: (code: string) => boolean;
    clearCoupon: () => void;
    getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Available coupons
const COUPONS: { [key: string]: number } = {
    'SAVE10': 10,
    'EXPERT20': 20,
    'FIRST50': 50,
    'NEWYEAR': 100,
};

export function CartProvider({ children }: { children: ReactNode }) {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const addToCart = (plan: Plan) => {
        setSelectedPlan(plan);
    };

    const removeFromCart = () => {
        setSelectedPlan(null);
        setCouponCode('');
        setDiscount(0);
    };

    const applyCoupon = (code: string): boolean => {
        const upperCode = code.toUpperCase();
        if (COUPONS[upperCode]) {
            setCouponCode(upperCode);
            setDiscount(COUPONS[upperCode]);
            return true;
        }
        return false;
    };

    const clearCoupon = () => {
        setCouponCode('');
        setDiscount(0);
    };

    const getTotal = () => {
        if (!selectedPlan) return 0;
        return Math.max(0, selectedPlan.price - discount);
    };

    return (
        <CartContext.Provider value={{
            selectedPlan,
            couponCode,
            discount,
            addToCart,
            removeFromCart,
            applyCoupon,
            clearCoupon,
            getTotal,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
