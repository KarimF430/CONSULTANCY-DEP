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

interface UserInfo {
    name: string;
    phone: string;
    email: string;
}

interface CartContextType {
    cartItems: Plan[];
    couponCode: string;
    discount: number;
    userInfo: UserInfo | null;
    addToCart: (plan: Plan) => void;
    removeFromCart: (planId: number) => void;
    clearCart: () => void;
    applyCoupon: (code: string) => boolean;
    clearCoupon: () => void;
    getSubtotal: () => number;
    getTotal: () => number;
    setUserInfo: (info: UserInfo) => void;
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
    const [cartItems, setCartItems] = useState<Plan[]>([]);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [userInfo, setUserInfoState] = useState<UserInfo | null>(null);

    const addToCart = (plan: Plan) => {
        // Check if plan already exists in cart
        const exists = cartItems.some(item => item.id === plan.id);
        if (!exists) {
            setCartItems(prev => [...prev, plan]);
        }
    };

    const removeFromCart = (planId: number) => {
        setCartItems(prev => prev.filter(item => item.id !== planId));
    };

    const clearCart = () => {
        setCartItems([]);
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

    const getSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + item.price, 0);
    };

    const getTotal = () => {
        const subtotal = getSubtotal();
        return Math.max(0, subtotal - discount);
    };

    const setUserInfo = (info: UserInfo) => {
        setUserInfoState(info);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            couponCode,
            discount,
            userInfo,
            addToCart,
            removeFromCart,
            clearCart,
            applyCoupon,
            clearCoupon,
            getSubtotal,
            getTotal,
            setUserInfo,
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
