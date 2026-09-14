import Breadcrumbs from '@/Components/store/Breadcrumbs';
import { useCart } from '@/Context/CartContext';
import StoreLayout from '@/Layouts/StoreLayout';
import { usePrice } from '@/lib/format';
import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    CreditCard,
    Lock,
    ShieldCheck,
    Tag,
    Trees,
    Truck,
} from 'lucide-react';
import React, { useState } from 'react';

interface Country {
    code: string;
    name: string;
}

interface CheckoutProps {
    countries: Country[];
    shipping: {
        name: string;
        rate: number;
        freeThreshold: number;
    };
    errors?: Record<string, string>;
}

export default function CheckoutIndex({ countries, shipping: shippingConfig, errors = {} }: CheckoutProps) {
    const {
        items,
        subtotal,
        discount,
        shipping,
        total,
        treesPlanted,
        coupon,
        couponError,
        isApplyingCoupon,
        applyCoupon,
        removeCoupon,
        clearCart,
    } = useCart();

    const price = usePrice();

    const [form, setForm] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        shipping_address_line1: '',
        shipping_address_line2: '',
        city: '',
        postal_code: '',
        country_code: 'DE',
        notes: '',
    });

    const [couponInput, setCouponInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (clientErrors[name]) {
            setClientErrors((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponInput.trim()) return;
        const success = await applyCoupon(couponInput);
        if (success) {
            setCouponInput('');
        }
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.email.trim()) errs.email = 'Email address is required.';
        if (!form.first_name.trim()) errs.first_name = 'First name is required.';
        if (!form.last_name.trim()) errs.last_name = 'Last name is required.';
        if (!form.shipping_address_line1.trim()) errs.shipping_address_line1 = 'Street address is required.';
        if (!form.city.trim()) errs.city = 'City is required.';
        if (!form.postal_code.trim()) errs.postal_code = 'Postal code is required.';
        if (!form.country_code) errs.country_code = 'Please select a country.';
        return errs;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setClientErrors(validationErrors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);

        router.post(
            route('checkout.store'),
            {
                ...form,
                coupon_code: coupon?.code ?? null,
                items: items.map((i) => ({
                    handle: i.handle,
                    title: i.title,
                    color_name: i.color_name,
                    size: i.size,
                    sku: i.sku,
                    price: i.price,
                    quantity: i.quantity,
                    image_src: i.image_src,
                })),
            },
            {
                onSuccess: () => {
                    clearCart();
                },
                onError: (backendErrors) => {
                    setIsSubmitting(false);
                    setClientErrors(backendErrors);
                },
            }
        );
    };

    if (items.length === 0) {
        return (
            <StoreLayout>
                <Head title="Checkout — EverGrove" />
                <div className="u-container py-20 text-center">
                    <h1 className="font-display text-2xl font-bold uppercase">Your Bag is Empty</h1>
                    <p className="mt-2 text-sm text-muted">
                        Please add items to your bag before proceeding to checkout.
                    </p>
                    <Link
                        href={route('catalog')}
                        className="mt-6 inline-flex h-12 items-center justify-center rounded bg-ink px-8 text-xs font-semibold uppercase tracking-widest text-paper hover:bg-ink/90"
                    >
                        Browse Products
                    </Link>
                </div>
            </StoreLayout>
        );
    }

    return (
        <StoreLayout>
            <Head title="Guest Checkout — EverGrove" />

            <div className="u-container pb-4 pt-6">
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: route('home') },
                        { label: 'Shop', href: route('catalog') },
                        { label: 'Checkout' },
                    ]}
                />
            </div>

            <div className="u-container pb-20 pt-4">
                <div className="grid gap-12 lg:grid-cols-12">
                    {/* Left Column: Guest Checkout Form */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center justify-between border-b border-line pb-4">
                            <div>
                                <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
                                    Express Guest Checkout
                                </h1>
                                <p className="mt-1 text-sm text-muted">
                                    No account needed • 100% secure encrypted checkout
                                </p>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-forest">
                                <ShieldCheck className="h-4 w-4" />
                                <span>SSL Protected</span>
                            </div>
                        </div>

                        {/* Top Global Errors */}
                        {(Object.keys(clientErrors).length > 0 || Object.keys(errors).length > 0) && (
                            <div className="mt-6 rounded bg-sale/10 p-4 text-sm text-sale">
                                <p className="font-semibold">Please check the required fields below:</p>
                                <ul className="mt-1.5 list-inside list-disc text-xs space-y-1">
                                    {Object.values({ ...errors, ...clientErrors }).map((msg, idx) => (
                                        <li key={idx}>{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-8 space-y-10">
                            {/* 1. Contact Information */}
                            <section>
                                <h2 className="font-display text-base font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                                    <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs font-bold text-paper">
                                        1
                                    </span>
                                    Contact Information
                                </h2>

                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                                            Email Address * (for order confirmation)
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={form.email}
                                            onChange={handleInputChange}
                                            placeholder="alex@example.com"
                                            className="mt-1.5 h-11 w-full rounded border border-line bg-paper px-3 text-sm focus:border-ink focus:ring-0"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                required
                                                value={form.first_name}
                                                onChange={handleInputChange}
                                                placeholder="Alex"
                                                className="mt-1.5 h-11 w-full rounded border border-line bg-paper px-3 text-sm focus:border-ink focus:ring-0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                required
                                                value={form.last_name}
                                                onChange={handleInputChange}
                                                placeholder="Vance"
                                                className="mt-1.5 h-11 w-full rounded border border-line bg-paper px-3 text-sm focus:border-ink focus:ring-0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                                            Phone Number (optional for courier updates)
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleInputChange}
                                            placeholder="+49 170 1234567"
                                            className="mt-1.5 h-11 w-full rounded border border-line bg-paper px-3 text-sm focus:border-ink focus:ring-0"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* 2. Shipping Address */}
                            <section>
                                <h2 className="font-display text-base font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                                    <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs font-bold text-paper">
                                        2
                                    </span>
                                    Delivery Address (EU Only)
                                </h2>

                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                                            Country / Region *
                                        </label>
                                        <select
                                            name="country_code"
                                            value={form.country_code}
                                            onChange={handleInputChange}
                                            className="mt-1.5 h-11 w-full rounded border border-line bg-paper px-3 text-sm focus:border-ink focus:ring-0"
                                        >
                                            {countries.map((c) => (
                                                <option key={c.code} value={c.code}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="shipping_address_line1"
                                            required
                                            value={form.shipping_address_line1}
                                            onChange={handleInputChange}
                                            placeholder="Friedrichstraße 43"
                                            className="mt-1.5 h-11 w-full rounded border border-line bg-paper px-3 text-sm focus:border-ink focus:ring-0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                                            Apartment, suite, unit (optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="shipping_address_line2"
                                            value={form.shipping_address_line2}
                                            onChange={handleInputChange}
                                            placeholder="Apt 4B"
                                            className="mt-1.5 h-11 w-full rounded border border-line bg-paper px-3 text-sm focus:border-ink focus:ring-0"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                value={form.city}
                                                onChange={handleInputChange}
                                                placeholder="Berlin"
                                                className="mt-1.5 h-11 w-full rounded border border-line bg-paper px-3 text-sm focus:border-ink focus:ring-0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                                                Postal / Zip Code *
                                            </label>
                                            <input
                                                type="text"
                                                name="postal_code"
                                                required
                                                value={form.postal_code}
                                                onChange={handleInputChange}
                                                placeholder="10117"
                                                className="mt-1.5 h-11 w-full rounded border border-line bg-paper px-3 text-sm focus:border-ink focus:ring-0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 3. Shipping Method */}
                            <section>
                                <h2 className="font-display text-base font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                                    <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs font-bold text-paper">
                                        3
                                    </span>
                                    Shipping Method
                                </h2>

                                <div className="mt-4 rounded-lg border border-ink bg-surface/50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="grid h-5 w-5 place-items-center rounded-full border-2 border-ink bg-ink text-paper">
                                                <div className="h-2 w-2 rounded-full bg-paper" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-ink">
                                                    Standard EU Tracked Delivery
                                                </p>
                                                <p className="text-xs text-muted">
                                                    Estimated 3–7 business days • Plastic-free recyclable packaging
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-ink">
                                            {shipping === 0 ? (
                                                <span className="font-semibold text-forest">FREE</span>
                                            ) : (
                                                price(shipping)
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* 4. Payment Method */}
                            <section>
                                <h2 className="font-display text-base font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                                    <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs font-bold text-paper">
                                        4
                                    </span>
                                    Payment Method
                                </h2>

                                <div className="mt-4 rounded-lg border border-line bg-paper p-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="grid h-5 w-5 place-items-center rounded-full border-2 border-ink bg-ink text-paper">
                                                <div className="h-2 w-2 rounded-full bg-paper" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-ink flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4" />
                                                    Credit / Debit Card (1-Click Instant Demo)
                                                </p>
                                                <p className="text-xs text-muted">
                                                    Fast authorization without manual card entry for testing
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5 text-xs text-muted font-bold">
                                            <span className="rounded bg-surface px-1.5 py-0.5 border border-line">VISA</span>
                                            <span className="rounded bg-surface px-1.5 py-0.5 border border-line">MC</span>
                                            <span className="rounded bg-surface px-1.5 py-0.5 border border-line">AMEX</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded bg-surface/70 p-3 text-xs text-muted flex items-start gap-2">
                                        <Lock className="h-4 w-4 shrink-0 text-forest mt-0.5" />
                                        <span>
                                            Your transaction is encrypted with 256-bit SSL security. Clicking <strong>Complete Order</strong> will instantly process the order and generate your confirmation certificate.
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex h-14 w-full items-center justify-center rounded bg-ink px-8 text-sm font-bold uppercase tracking-widest text-paper shadow-lg transition-all hover:bg-ink/90 active:scale-[0.99] disabled:opacity-50"
                            >
                                {isSubmitting ? 'Processing Order...' : `Complete Order • ${price(total)}`}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Order Summary & Tree Certificate */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-28 rounded-lg border border-line bg-paper p-6 shadow-sm">
                            <h2 className="font-display text-lg font-bold uppercase tracking-wide border-b border-line pb-4">
                                Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)
                            </h2>

                            {/* Tree Planting Highlight Box */}
                            <div className="mt-4 flex items-center gap-3 rounded-md bg-forest/10 p-3.5 text-forest">
                                <Trees className="h-6 w-6 shrink-0" strokeWidth={2} />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider">
                                        {treesPlanted} Trees Will Be Planted 🌲
                                    </p>
                                    <p className="text-xs text-forest/90">
                                        Every item in your order plants 10 verified trees with our global reforestation partners.
                                    </p>
                                </div>
                            </div>

                            {/* Items Preview */}
                            <ul className="mt-5 max-h-80 divide-y divide-line overflow-y-auto pr-1">
                                {items.map((item) => (
                                    <li key={item.id} className="flex items-center gap-3.5 py-3">
                                        <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded bg-surface">
                                            {item.image_src ? (
                                                <img
                                                    src={item.image_src}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : null}
                                            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-paper shadow">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <p className="text-xs font-semibold leading-snug">{item.title}</p>
                                            <p className="text-[11px] text-muted">
                                                {item.color_name && <span>{item.color_name} • </span>}
                                                <span>Size: {item.size}</span>
                                            </p>
                                        </div>
                                        <div className="text-right text-xs font-bold">
                                            {price(item.price * item.quantity)}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Coupon Form */}
                            <div className="mt-6 border-t border-line pt-4">
                                {coupon ? (
                                    <div className="flex items-center justify-between rounded bg-surface p-2.5 text-xs">
                                        <div className="flex items-center gap-1.5 font-medium text-forest">
                                            <Tag className="h-3.5 w-3.5" />
                                            <span>Coupon <strong>{coupon.code}</strong> applied</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeCoupon}
                                            className="font-semibold text-muted hover:text-sale"
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
                                            className="h-10 flex-1 rounded border border-line bg-paper px-3 text-xs uppercase placeholder:normal-case focus:border-ink focus:ring-0"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isApplyingCoupon || !couponInput.trim()}
                                            className="h-10 rounded bg-surface px-4 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
                                        >
                                            {isApplyingCoupon ? '...' : 'Apply'}
                                        </button>
                                    </form>
                                )}

                                {couponError && (
                                    <p className="mt-1.5 text-xs text-sale">{couponError}</p>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="mt-5 space-y-2 border-t border-line pt-4 text-xs text-muted">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-ink">{price(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between font-medium text-sale">
                                        <span>Discount ({coupon?.code})</span>
                                        <span>-{price(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Shipping (EU Standard 3–7 days)</span>
                                    <span className="font-medium text-ink">
                                        {shipping === 0 ? (
                                            <span className="font-semibold text-forest">FREE</span>
                                        ) : (
                                            price(shipping)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-line pt-3 text-lg font-bold text-ink">
                                    <span>Total (EUR)</span>
                                    <span>{price(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
