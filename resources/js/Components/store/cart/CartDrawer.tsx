import { useCart } from '@/Context/CartContext';
import { usePrice } from '@/lib/format';
import { Link, router } from '@inertiajs/react';
import { Minus, Plus, ShoppingBag, Tag, Trash2, Trees, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function CartDrawer() {
    const {
        items,
        isOpen,
        closeCart,
        coupon,
        couponError,
        isApplyingCoupon,
        subtotal,
        discount,
        shipping,
        total,
        itemCount,
        treesPlanted,
        freeShippingThreshold,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
    } = useCart();

    const price = usePrice();
    const [couponInput, setCouponInput] = useState('');

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponInput.trim()) return;
        const success = await applyCoupon(couponInput);
        if (success) {
            setCouponInput('');
        }
    };

    const handleCheckout = () => {
        closeCart();
        router.visit(route('checkout'));
    };

    if (!isOpen) return null;

    const progressToFreeShipping = Math.min(
        100,
        Math.round((subtotal / freeShippingThreshold) * 100)
    );
    const amountNeededForFreeShipping = Math.max(
        0,
        Math.round((freeShippingThreshold - subtotal) * 100) / 100
    );

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-ink/50 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Slide-over Panel */}
            <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ease-in-out">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-line px-6 py-5">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                        <h2 className="font-display text-lg font-bold uppercase tracking-wide">
                            Your Bag ({itemCount})
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={closeCart}
                        aria-label="Close cart"
                        className="grid h-9 w-9 place-items-center rounded-full text-ink/70 transition-colors hover:bg-surface hover:text-ink"
                    >
                        <X className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Free Shipping & Tree Planting Banner */}
                {items.length > 0 && (
                    <div className="border-b border-line bg-surface/60 px-6 py-4">
                        {/* Tree planting banner */}
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest">
                            <Trees className="h-4 w-4 shrink-0" strokeWidth={2} />
                            <span>This order plants {treesPlanted} trees! 🌲</span>
                        </div>

                        {/* Free Shipping Progress */}
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-muted">
                                <span>
                                    {subtotal >= freeShippingThreshold ? (
                                        <span className="font-semibold text-forest">
                                            🎉 FREE EU Standard Shipping unlocked!
                                        </span>
                                    ) : (
                                        <span>
                                            Add <strong className="text-ink">{price(amountNeededForFreeShipping)}</strong> for Free EU Shipping
                                        </span>
                                    )}
                                </span>
                                <span>{progressToFreeShipping}%</span>
                            </div>
                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-line">
                                <div
                                    className="h-full bg-forest transition-all duration-300"
                                    style={{ width: `${progressToFreeShipping}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Items List */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center py-12">
                            <div className="grid h-16 w-16 place-items-center rounded-full bg-surface">
                                <ShoppingBag className="h-8 w-8 text-muted" strokeWidth={1.5} />
                            </div>
                            <h3 className="mt-4 font-display text-lg font-bold uppercase">
                                Your bag is empty
                            </h3>
                            <p className="mt-1 max-w-xs text-sm text-muted">
                                Discover our sustainable collection made with organic cotton, hemp, and Tencel.
                            </p>
                            <Link
                                href={route('catalog')}
                                onClick={closeCart}
                                className="mt-6 inline-flex h-11 items-center justify-center rounded bg-ink px-6 text-xs font-semibold uppercase tracking-widest text-paper transition-opacity hover:opacity-90"
                            >
                                Explore Catalog
                            </Link>
                        </div>
                    ) : (
                        <ul className="divide-y divide-line">
                            {items.map((item) => (
                                <li key={item.id} className="flex gap-4 py-4">
                                    {/* Product Image */}
                                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded bg-surface">
                                        {item.image_src ? (
                                            <img
                                                src={item.image_src}
                                                alt={item.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="grid h-full w-full place-items-center text-xs text-muted">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <Link
                                                    href={route('products.show', item.handle)}
                                                    onClick={closeCart}
                                                    className="font-medium text-sm hover:underline"
                                                >
                                                    {item.title}
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    aria-label={`Remove ${item.title}`}
                                                    className="text-muted transition-colors hover:text-sale"
                                                >
                                                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                                                </button>
                                            </div>
                                            <p className="mt-1 text-xs text-muted">
                                                {item.color_name && <span>{item.color_name} • </span>}
                                                <span>Size: {item.size}</span>
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            {/* Quantity Stepper */}
                                            <div className="flex items-center rounded border border-line">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.quantity - 1)
                                                    }
                                                    aria-label="Decrease quantity"
                                                    className="grid h-7 w-7 place-items-center text-muted transition-colors hover:text-ink"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-6 text-center text-xs font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.quantity + 1)
                                                    }
                                                    aria-label="Increase quantity"
                                                    className="grid h-7 w-7 place-items-center text-muted transition-colors hover:text-ink"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right text-sm font-semibold">
                                                {price(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer / Summary */}
                {items.length > 0 && (
                    <div className="border-t border-line bg-paper px-6 py-5">
                        {/* Coupon Form */}
                        <div className="mb-4">
                            {coupon ? (
                                <div className="flex items-center justify-between rounded bg-surface p-2.5 text-xs">
                                    <div className="flex items-center gap-1.5 font-medium text-forest">
                                        <Tag className="h-3.5 w-3.5" />
                                        <span>Coupon <strong>{coupon.code}</strong> applied (-{price(discount)})</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeCoupon}
                                        className="text-muted hover:text-sale font-semibold ml-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        placeholder="Promo Code (e.g. EVER10)"
                                        className="h-9 flex-1 rounded border border-line bg-paper px-3 text-xs uppercase placeholder:normal-case placeholder:text-muted focus:border-ink focus:ring-0"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isApplyingCoupon || !couponInput.trim()}
                                        className="h-9 rounded bg-surface px-4 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
                                    >
                                        {isApplyingCoupon ? '...' : 'Apply'}
                                    </button>
                                </form>
                            )}

                            {couponError && (
                                <p className="mt-1.5 text-xs text-sale">{couponError}</p>
                            )}
                        </div>

                        {/* Totals Breakdown */}
                        <div className="space-y-1.5 text-xs text-muted">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-medium text-ink">{price(subtotal)}</span>
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between text-sale font-medium">
                                    <span>Discount</span>
                                    <span>-{price(discount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span>Shipping (EU Standard)</span>
                                <span className="font-medium text-ink">
                                    {shipping === 0 ? (
                                        <span className="text-forest font-semibold">FREE</span>
                                    ) : (
                                        price(shipping)
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between border-t border-line pt-2 text-base font-bold text-ink">
                                <span>Total</span>
                                <span>{price(total)}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            type="button"
                            onClick={handleCheckout}
                            className="mt-5 flex h-12 w-full items-center justify-center rounded bg-ink px-6 text-xs font-bold uppercase tracking-widest text-paper shadow-md transition-all hover:bg-ink/90 active:scale-[0.99]"
                        >
                            Proceed to Checkout • {price(total)}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
