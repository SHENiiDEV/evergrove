import Breadcrumbs from '@/Components/store/Breadcrumbs';
import StoreLayout from '@/Layouts/StoreLayout';
import { usePrice } from '@/lib/format';
import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    FileText,
    Mail,
    Package,
    ShieldCheck,
    Trees,
    Truck,
} from 'lucide-react';
import React from 'react';

interface OrderItem {
    id: number;
    title: string;
    colorName?: string | null;
    size: string;
    price: number;
    quantity: number;
    total: number;
    imageSrc?: string | null;
}

interface OrderSuccessProps {
    order: {
        orderNumber: string;
        email: string;
        fullName: string;
        shippingAddress: {
            line1: string;
            line2?: string | null;
            city: string;
            postalCode: string;
            countryName: string;
        };
        shippingMethod: string;
        shippingCost: number;
        subtotal: number;
        discountAmount: number;
        couponCode?: string | null;
        total: number;
        treesPlanted: number;
        createdAt: string;
        items: OrderItem[];
    };
}

export default function OrderSuccess({ order }: OrderSuccessProps) {
    const price = usePrice();

    return (
        <StoreLayout>
            <Head title={`Order Confirmed #${order.orderNumber} — EverGrove`} />

            <div className="u-container pb-4 pt-6">
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: route('home') },
                        { label: 'Orders' },
                        { label: `#${order.orderNumber}` },
                    ]}
                />
            </div>

            <div className="u-container max-w-4xl pb-24 pt-4">
                {/* Success Banner */}
                <div className="rounded-xl border border-line bg-surface/50 p-8 text-center sm:p-12">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#2F4636] text-white shadow-md">
                        <CheckCircle2 className="h-9 w-9 text-white" strokeWidth={2} />
                    </div>

                    <h1 className="mt-5 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl text-ink">
                        Thank You, {order.fullName.split(' ')[0]}!
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        Your order <strong>#{order.orderNumber}</strong> is confirmed and being prepared for shipment.
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-xs font-medium text-muted shadow-sm border border-line">
                        <Mail className="h-4 w-4 text-[#2F4636]" />
                        <span>Confirmation sent to <strong>{order.email}</strong></span>
                    </div>
                </div>

                {/* Tree Planting Certificate Card */}
                <div className="mt-8 overflow-hidden rounded-xl border border-[#3E5A45] bg-[#2F4636] text-white shadow-lg">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 text-center sm:text-left">
                                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/10 border border-white/20">
                                    <Trees className="h-9 w-9 text-white" strokeWidth={1.75} />
                                </div>
                                <div>
                                    <span className="text-xs uppercase tracking-widest text-white/80 font-bold">
                                        Official EverGrove Reforestation Certificate
                                    </span>
                                    <h2 className="mt-1 font-display text-2xl font-bold uppercase text-white">
                                        {order.treesPlanted} Trees Planted 🌲
                                    </h2>
                                    <p className="mt-1 text-xs text-white/90 max-w-lg">
                                        Your purchase directly funds the planting and protection of verified native trees through our non-profit reforestation partners.
                                    </p>
                                </div>
                            </div>
                            <div className="rounded bg-white/15 px-4 py-2 text-center text-xs font-semibold tracking-wider uppercase text-white border border-white/20 shrink-0">
                                Verified Eco-Impact
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Details & Items Grid */}
                <div className="mt-10 grid gap-8 md:grid-cols-12">
                    {/* Items List */}
                    <div className="md:col-span-7">
                        <div className="rounded-lg border border-line bg-paper p-6">
                            <h3 className="font-display text-base font-bold uppercase tracking-wider text-ink border-b border-line pb-4 flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Items Ordered ({order.items.reduce((s, i) => s + i.quantity, 0)})
                            </h3>

                            <ul className="mt-4 divide-y divide-line">
                                {order.items.map((item) => (
                                    <li key={item.id} className="flex gap-4 py-4 first:pt-0">
                                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-surface">
                                            {item.imageSrc ? (
                                                <img
                                                    src={item.imageSrc}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : null}
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <p className="font-semibold text-sm">{item.title}</p>
                                                <p className="mt-1 text-xs text-muted">
                                                    {item.colorName && <span>{item.colorName} • </span>}
                                                    <span>Size: {item.size}</span>
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-muted pt-2">
                                                <span>Qty: {item.quantity}</span>
                                                <span className="font-bold text-sm text-ink">
                                                    {price(item.total)}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Summary Table */}
                            <div className="mt-6 border-t border-line pt-4 space-y-2 text-xs text-muted">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-ink">{price(order.subtotal)}</span>
                                </div>
                                {order.discountAmount > 0 && (
                                    <div className="flex justify-between text-sale font-medium">
                                        <span>Discount ({order.couponCode})</span>
                                        <span>-{price(order.discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Shipping (EU Standard 3–7 days)</span>
                                    <span className="font-medium text-ink">
                                        {order.shippingCost === 0 ? (
                                            <span className="font-semibold text-forest">FREE</span>
                                        ) : (
                                            price(order.shippingCost)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-line pt-3 text-base font-bold text-ink">
                                    <span>Total Paid</span>
                                    <span>{price(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery & Next Steps */}
                    <div className="md:col-span-5 space-y-6">
                        <div className="rounded-lg border border-line bg-paper p-6">
                            <h3 className="font-display text-base font-bold uppercase tracking-wider text-ink border-b border-line pb-4 flex items-center gap-2">
                                <Truck className="h-4 w-4" />
                                Delivery Details
                            </h3>

                            <div className="mt-4 space-y-3 text-sm">
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted tracking-wider">
                                        Shipping Address:
                                    </p>
                                    <p className="mt-1 font-medium text-ink leading-relaxed">
                                        {order.fullName}<br />
                                        {order.shippingAddress.line1}
                                        {order.shippingAddress.line2 && <><br />{order.shippingAddress.line2}</>}
                                        <br />{order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                        <br />{order.shippingAddress.countryName}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-line">
                                    <p className="text-xs uppercase font-semibold text-muted tracking-wider">
                                        Shipping Method:
                                    </p>
                                    <p className="mt-1 font-medium text-ink">
                                        Standard EU Tracked (3–7 business days)
                                    </p>
                                    <p className="text-xs text-muted mt-1">
                                        Dispatched in recyclable plastic-free mailers.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <a
                                href={route('orders.invoice', order.orderNumber)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-12 w-full items-center justify-center gap-2 rounded border border-line bg-paper px-6 text-xs font-bold uppercase tracking-widest text-ink shadow-sm transition-colors hover:bg-surface hover:border-ink"
                            >
                                <FileText className="h-4 w-4 text-forest" />
                                Download PDF Invoice
                            </a>
                            <Link
                                href={route('catalog')}
                                className="flex h-12 w-full items-center justify-center rounded bg-ink px-6 text-xs font-bold uppercase tracking-widest text-paper shadow transition-colors hover:bg-ink/90"
                            >
                                Continue Shopping
                            </Link>
                            <Link
                                href={route('home')}
                                className="flex h-12 w-full items-center justify-center rounded border border-line bg-paper px-6 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-surface"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
