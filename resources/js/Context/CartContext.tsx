import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
    id: string; // `${handle}-${size}`
    handle: string;
    title: string;
    color_name?: string;
    size: string;
    sku?: string;
    price: number;
    compareAtPrice?: number | null;
    quantity: number;
    image_src?: string | null;
}

export interface AppliedCoupon {
    code: string;
    type: string;
    value: number;
    discount: number;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    coupon: AppliedCoupon | null;
    couponError: string | null;
    isApplyingCoupon: boolean;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    itemCount: number;
    treesPlanted: number;
    freeShippingThreshold: number;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    applyCoupon: (code: string) => Promise<boolean>;
    removeCoupon: () => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'evergrove_cart_items';
const COUPON_KEY = 'evergrove_cart_coupon';
const FREE_SHIPPING_THRESHOLD = 100.0;
const STANDARD_SHIPPING_RATE = 4.95;

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [coupon, setCoupon] = useState<AppliedCoupon | null>(() => {
        if (typeof window === 'undefined') return null;
        try {
            const saved = localStorage.getItem(COUPON_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [isOpen, setIsOpen] = useState(false);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // Persist items
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // ignore localStorage quota
        }
    }, [items]);

    // Persist coupon
    useEffect(() => {
        try {
            if (coupon) {
                localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
            } else {
                localStorage.removeItem(COUPON_KEY);
            }
        } catch {
            // ignore
        }
    }, [coupon]);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    const toggleCart = () => setIsOpen((prev) => !prev);

    const addItem = (item: Omit<CartItem, 'id'>) => {
        const id = `${item.handle}-${item.size}`;
        setItems((prev) => {
            const existing = prev.find((i) => i.id === id);
            if (existing) {
                return prev.map((i) =>
                    i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prev, { ...item, id }];
        });
        setIsOpen(true);
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
        setCoupon(null);
    };

    // Computations
    const subtotal = items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const treesPlanted = itemCount * 10;

    // Recalculate discount based on current subtotal
    let discount = 0;
    let isFreeShippingCoupon = false;

    if (coupon) {
        if (coupon.type === 'percent') {
            discount = Math.round(((subtotal * coupon.value) / 100) * 100) / 100;
        } else if (coupon.type === 'fixed') {
            discount = Math.min(subtotal, coupon.value);
        } else if (coupon.type === 'free_shipping') {
            isFreeShippingCoupon = true;
        }
    }

    const isFreeShipping =
        subtotal >= FREE_SHIPPING_THRESHOLD || isFreeShippingCoupon || items.length === 0;

    const shipping = items.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_RATE;
    const total = Math.max(0, Math.round((subtotal - discount + shipping) * 100) / 100);

    const applyCoupon = async (code: string): Promise<boolean> => {
        setCouponError(null);
        setIsApplyingCoupon(true);

        try {
            const response = await axios.post('/cart/coupon/apply', {
                code: code.trim(),
                subtotal,
            });

            if (response.data?.valid) {
                setCoupon(response.data.coupon);
                setCouponError(null);
                setIsApplyingCoupon(false);
                return true;
            }

            setCouponError(response.data?.message || 'Invalid coupon.');
            setIsApplyingCoupon(false);
            return false;
        } catch (err: any) {
            const msg =
                err.response?.data?.message || 'Invalid or expired coupon code.';
            setCouponError(msg);
            setIsApplyingCoupon(false);
            return false;
        }
    };

    const removeCoupon = () => {
        setCoupon(null);
        setCouponError(null);
    };

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                coupon,
                couponError,
                isApplyingCoupon,
                subtotal,
                discount,
                shipping,
                total,
                itemCount,
                treesPlanted,
                freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
                openCart,
                closeCart,
                toggleCart,
                addItem,
                removeItem,
                updateQuantity,
                applyCoupon,
                removeCoupon,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
