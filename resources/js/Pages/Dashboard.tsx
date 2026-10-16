import Button from '@/Components/ui/Button';
import StoreLayout from '@/Layouts/StoreLayout';
import { usePrice } from '@/lib/format';
import { PageProps } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Download,
    Eye,
    EyeOff,
    FileText,
    KeyRound,
    Leaf,
    Lock,
    LogOut,
    Mail,
    MapPin,
    Package,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Trees,
    Truck,
    User,
} from 'lucide-react';
import React, { useState } from 'react';

interface OrderItemData {
    id: number;
    product_handle: string;
    title: string;
    color_name?: string | null;
    size: string;
    price: number;
    quantity: number;
    total: number;
    image_src?: string | null;
}

interface OrderData {
    id: number;
    order_number: string;
    date: string;
    iso_date: string;
    status: string;
    payment_status: string;
    subtotal: number;
    discount_amount: number;
    shipping_cost: number;
    shipping_method_name: string;
    coupon_code?: string | null;
    total: number;
    trees_planted: number;
    notes?: string | null;
    invoice_url: string;
    shipping_address: {
        recipient: string;
        line1: string;
        line2?: string | null;
        city: string;
        postal_code: string;
        country_name: string;
        phone?: string | null;
    };
    items: OrderItemData[];
}

interface DashboardProps {
    stats: {
        total_orders: number;
        total_spent: number;
        trees_planted: number;
        member_since: string;
    };
    orders: OrderData[];
    status?: string;
}

export default function Dashboard({ stats, orders, status }: DashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const price = usePrice();
    const [activeTab, setActiveTab] = useState<'orders' | 'settings' | 'impact'>('orders');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    // Profile update form
    const profileForm = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    // Password change form
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-forest/10 text-forest border border-forest/20">
                        <CheckCircle2 className="h-3 w-3" />
                        Delivered
                    </span>
                );
            case 'shipped':
            case 'dispatched':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                        <Truck className="h-3 w-3" />
                        Dispatched
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-red-50 text-sale border border-red-200">
                        Cancelled
                    </span>
                );
            case 'processing':
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="h-3 w-3" />
                        Processing
                    </span>
                );
        }
    };

    return (
        <StoreLayout>
            <Head title="Customer Account & Orders — Evergrove" />

            <div className="u-container py-10 sm:py-14 lg:py-18">
                {/* Account Welcome Bar */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-line">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="u-label text-muted">Customer Dashboard</span>
                            <span className="h-1 w-1 rounded-full bg-muted/60" />
                            <span className="text-xs text-muted">Member since {stats.member_since}</span>
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-ink">
                            Welcome back, {auth.user.name.split(' ')[0]}
                        </h1>
                        <p className="mt-1 text-sm text-muted">
                            {auth.user.email}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            href={route('catalog')}
                            variant="outline"
                            size="md"
                            className="hidden sm:inline-flex"
                        >
                            <ShoppingBag className="h-4 w-4 mr-1.5" />
                            Shop Catalog
                        </Button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded border border-line bg-surface/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink hover:bg-surface transition-colors"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Status alert */}
                {status && (
                    <div className="mt-6 rounded border border-forest/20 bg-forest/5 p-4 text-sm text-forest font-medium">
                        {status}
                    </div>
                )}

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-8">
                    {/* Orders Metric */}
                    <div className="border border-line bg-paper p-5 sm:p-6 rounded shadow-sm">
                        <div className="flex items-center justify-between text-muted mb-2">
                            <span className="u-label">Total Orders</span>
                            <Package className="h-4 w-4" strokeWidth={1.5} />
                        </div>
                        <div className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                            {stats.total_orders}
                        </div>
                        <p className="mt-1 text-xs text-muted">
                            {stats.total_orders === 1 ? '1 order placed' : `${stats.total_orders} orders placed`}
                        </p>
                    </div>

                    {/* Trees Impact Metric */}
                    <div className="border border-line bg-paper p-5 sm:p-6 rounded shadow-sm relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Trees className="h-28 w-28 text-forest" />
                        </div>
                        <div className="flex items-center justify-between text-forest mb-2">
                            <span className="u-label">Trees Planted</span>
                            <Trees className="h-4 w-4" strokeWidth={1.8} />
                        </div>
                        <div className="font-display text-3xl sm:text-4xl font-bold text-forest tracking-tight">
                            {stats.trees_planted}
                        </div>
                        <p className="mt-1 text-xs text-muted">
                            {stats.trees_planted * 25} kg CO₂ offset funded
                        </p>
                    </div>

                    {/* Total Value Metric */}
                    <div className="border border-line bg-paper p-5 sm:p-6 rounded shadow-sm">
                        <div className="flex items-center justify-between text-muted mb-2">
                            <span className="u-label">Lifetime Value</span>
                            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                        </div>
                        <div className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                            {price(stats.total_spent)}
                        </div>
                        <p className="mt-1 text-xs text-muted">
                            Carbon-neutral delivery across Europe
                        </p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mt-10 border-b border-line flex items-center gap-8">
                    <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className={`pb-4 text-xs font-semibold uppercase tracking-wider relative transition-colors ${
                            activeTab === 'orders'
                                ? 'text-ink after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-ink'
                                : 'text-muted hover:text-ink'
                        }`}
                    >
                        Orders & History ({stats.total_orders})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('impact')}
                        className={`pb-4 text-xs font-semibold uppercase tracking-wider relative transition-colors ${
                            activeTab === 'impact'
                                ? 'text-ink after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-ink'
                                : 'text-muted hover:text-ink'
                        }`}
                    >
                        Forest Impact
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('settings')}
                        className={`pb-4 text-xs font-semibold uppercase tracking-wider relative transition-colors ${
                            activeTab === 'settings'
                                ? 'text-ink after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-ink'
                                : 'text-muted hover:text-ink'
                        }`}
                    >
                        Account & Security
                    </button>
                </div>

                {/* TAB 1: ORDERS & HISTORY */}
                {activeTab === 'orders' && (
                    <div className="mt-8 space-y-6">
                        {orders.length === 0 ? (
                            <div className="border border-dashed border-line bg-surface/30 p-12 sm:p-16 text-center rounded">
                                <div className="mx-auto h-12 w-12 rounded-full bg-surface grid place-items-center text-muted mb-4">
                                    <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-ink">
                                    No orders placed yet
                                </h3>
                                <p className="mt-2 text-sm text-muted max-w-md mx-auto">
                                    When you place an order with Evergrove, your tracking details, shipment status, and downloadable tax invoices will appear right here.
                                </p>
                                <div className="mt-6">
                                    <Button href={route('catalog')} variant="solid" size="md">
                                        Explore Sustainable Collection
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            orders.map((order) => {
                                const isExpanded = expandedOrder === order.order_number;

                                return (
                                    <div
                                        key={order.order_number}
                                        className="border border-line bg-paper rounded shadow-sm overflow-hidden transition-all duration-200"
                                    >
                                        {/* Order Card Header */}
                                        <div className="p-5 sm:p-6 bg-surface/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/60">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-sm sm:text-base font-bold text-ink">
                                                        {order.order_number}
                                                    </span>
                                                    {getStatusBadge(order.status)}
                                                </div>
                                                <p className="text-xs text-muted">
                                                    Placed on {order.date} · {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
                                                <div className="text-right sm:mr-2">
                                                    <span className="u-label text-muted block mb-0.5">Total</span>
                                                    <span className="font-display text-xl font-bold text-ink">
                                                        {price(order.total)}
                                                    </span>
                                                </div>

                                                {/* Download Invoice Button */}
                                                <a
                                                    href={order.invoice_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded border border-line bg-paper hover:bg-ink hover:text-paper hover:border-ink px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-ink transition-colors shadow-2xs"
                                                    title="Download Official Tax Invoice PDF"
                                                >
                                                    <FileText className="h-3.5 w-3.5" />
                                                    <span className="hidden sm:inline">Invoice</span>
                                                    <Download className="h-3 w-3" />
                                                </a>

                                                {/* Toggle Details Button */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setExpandedOrder(
                                                            isExpanded ? null : order.order_number
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink p-2 transition-colors"
                                                >
                                                    <span>{isExpanded ? 'Hide' : 'Details'}</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Order Items Preview */}
                                        <div className="p-5 sm:p-6 divide-y divide-line/60">
                                            {order.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {item.image_src ? (
                                                            <img
                                                                src={item.image_src}
                                                                alt={item.title}
                                                                className="h-16 w-14 object-cover object-center rounded border border-line bg-surface shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="h-16 w-14 rounded border border-line bg-surface shrink-0 grid place-items-center text-muted">
                                                                <Package className="h-5 w-5" strokeWidth={1.5} />
                                                            </div>
                                                        )}

                                                        <div>
                                                            <Link
                                                                href={route('products.show', item.product_handle)}
                                                                className="text-sm font-semibold text-ink hover:underline line-clamp-1"
                                                            >
                                                                {item.title}
                                                            </Link>
                                                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted">
                                                                {item.color_name && (
                                                                    <span>Color: {item.color_name}</span>
                                                                )}
                                                                {item.color_name && item.size && <span>•</span>}
                                                                {item.size && <span>Size: {item.size}</span>}
                                                                <span>•</span>
                                                                <span>Qty: {item.quantity}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right shrink-0">
                                                        <span className="text-sm font-semibold text-ink">
                                                            {price(item.total)}
                                                        </span>
                                                        <span className="block text-[11px] text-muted">
                                                            {price(item.price)} each
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Expanded Details Drawer */}
                                        {isExpanded && (
                                            <div className="p-5 sm:p-6 bg-surface/30 border-t border-line text-xs space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Delivery Address */}
                                                    <div>
                                                        <p className="u-label text-muted mb-2 flex items-center gap-1.5">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            Delivery Address
                                                        </p>
                                                        <p className="font-semibold text-ink">
                                                            {order.shipping_address.recipient}
                                                        </p>
                                                        <p className="text-muted mt-0.5">
                                                            {order.shipping_address.line1}
                                                        </p>
                                                        {order.shipping_address.line2 && (
                                                            <p className="text-muted">
                                                                {order.shipping_address.line2}
                                                            </p>
                                                        )}
                                                        <p className="text-muted">
                                                            {order.shipping_address.postal_code}{' '}
                                                            {order.shipping_address.city},{' '}
                                                            {order.shipping_address.country_name}
                                                        </p>
                                                        {order.shipping_address.phone && (
                                                            <p className="text-muted mt-1">
                                                                Tel: {order.shipping_address.phone}
                                                            </p>
                                                        )}
                                                        <p className="mt-2 text-[11px] text-muted italic">
                                                            Method: {order.shipping_method_name}
                                                        </p>
                                                    </div>

                                                    {/* Cost Breakdown */}
                                                    <div>
                                                        <p className="u-label text-muted mb-2">
                                                            Payment & Summary
                                                        </p>
                                                        <div className="space-y-1.5 text-xs text-muted">
                                                            <div className="flex justify-between">
                                                                <span>Subtotal</span>
                                                                <span className="font-medium text-ink">
                                                                    {price(order.subtotal)}
                                                                </span>
                                                            </div>
                                                            {order.discount_amount > 0 && (
                                                                <div className="flex justify-between text-sale font-medium">
                                                                    <span>
                                                                        Discount {order.coupon_code ? `(${order.coupon_code})` : ''}
                                                                    </span>
                                                                    <span>-{price(order.discount_amount)}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between">
                                                                <span>Shipping</span>
                                                                <span>
                                                                    {order.shipping_cost === 0
                                                                        ? 'FREE'
                                                                        : price(order.shipping_cost)}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between pt-2 border-t border-line font-bold text-sm text-ink">
                                                                <span>Total Paid</span>
                                                                <span>{price(order.total)}</span>
                                                            </div>
                                                        </div>

                                                        {/* Environmental impact for this order */}
                                                        <div className="mt-4 p-2.5 rounded bg-forest/10 border border-forest/20 flex items-center justify-between text-forest">
                                                            <span className="flex items-center gap-1.5 font-medium">
                                                                <Trees className="h-3.5 w-3.5" />
                                                                Eco Contribution
                                                            </span>
                                                            <span className="font-bold">
                                                                +{order.trees_planted} Trees Planted
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* TAB 2: FOREST IMPACT */}
                {activeTab === 'impact' && (
                    <div className="mt-8 space-y-6">
                        <div className="border border-line bg-paper p-8 sm:p-12 rounded shadow-sm text-center relative overflow-hidden">
                            <div className="pointer-events-none absolute -right-16 -top-16 opacity-5">
                                <Trees className="h-80 w-80 text-forest" />
                            </div>

                            <span className="u-label text-forest tracking-wider mb-2 block">
                                Verified Reforestation
                            </span>
                            <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-ink tracking-tight">
                                {stats.trees_planted} Trees Planted
                            </h2>
                            <p className="mt-3 text-sm text-muted max-w-xl mx-auto leading-relaxed">
                                Through your purchases with Evergrove, you have helped restore natural biodiversity and absorb atmospheric carbon across native woodland reserves in Europe.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8 pt-8 border-t border-line text-left">
                                <div className="border border-line/80 bg-surface/30 p-4 rounded">
                                    <Leaf className="h-5 w-5 text-forest mb-1.5" />
                                    <span className="u-label text-muted block">Carbon Absorption</span>
                                    <span className="text-base font-bold text-ink">~{stats.trees_planted * 25} kg / yr</span>
                                </div>
                                <div className="border border-line/80 bg-surface/30 p-4 rounded">
                                    <Trees className="h-5 w-5 text-forest mb-1.5" />
                                    <span className="u-label text-muted block">Conservation Area</span>
                                    <span className="text-base font-bold text-ink">Black Forest & Alps</span>
                                </div>
                                <div className="border border-line/80 bg-surface/30 p-4 rounded">
                                    <ShieldCheck className="h-5 w-5 text-forest mb-1.5" />
                                    <span className="u-label text-muted block">Audit Partner</span>
                                    <span className="text-base font-bold text-ink">Eden Project Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: ACCOUNT & SECURITY */}
                {activeTab === 'settings' && (
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Profile Info */}
                        <div className="border border-line bg-paper p-6 sm:p-8 rounded shadow-sm">
                            <div className="border-b border-line pb-4 mb-6">
                                <h2 className="font-display text-2xl font-bold uppercase text-ink">
                                    Profile Details
                                </h2>
                                <p className="text-xs text-muted mt-1">
                                    Update your name and primary email address.
                                </p>
                            </div>

                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="profile-name"
                                        className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                    >
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="profile-name"
                                            type="text"
                                            value={profileForm.data.name}
                                            onChange={(e) =>
                                                profileForm.setData('name', e.target.value)
                                            }
                                            required
                                            className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 pl-10 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink"
                                        />
                                        <User className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" />
                                    </div>
                                    {profileForm.errors.name && (
                                        <p className="mt-1 text-xs text-sale">
                                            {profileForm.errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="profile-email"
                                        className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="profile-email"
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) =>
                                                profileForm.setData('email', e.target.value)
                                            }
                                            required
                                            className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 pl-10 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink"
                                        />
                                        <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" />
                                    </div>
                                    {profileForm.errors.email && (
                                        <p className="mt-1 text-xs text-sale">
                                            {profileForm.errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-2 flex items-center justify-between">
                                    <Button
                                        type="submit"
                                        variant="solid"
                                        size="md"
                                        disabled={profileForm.processing}
                                    >
                                        {profileForm.processing ? 'Saving...' : 'Save Profile'}
                                    </Button>

                                    {profileForm.recentlySuccessful && (
                                        <span className="text-xs font-medium text-forest flex items-center gap-1">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Saved successfully
                                        </span>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Password Change */}
                        <div className="border border-line bg-paper p-6 sm:p-8 rounded shadow-sm">
                            <div className="border-b border-line pb-4 mb-6">
                                <h2 className="font-display text-2xl font-bold uppercase text-ink">
                                    Update Password
                                </h2>
                                <p className="text-xs text-muted mt-1">
                                    Ensure your account is using a long, random password.
                                </p>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="current-password"
                                        className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                    >
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="current-password"
                                            type={showCurrentPass ? 'text' : 'password'}
                                            value={passwordForm.data.current_password}
                                            onChange={(e) =>
                                                passwordForm.setData(
                                                    'current_password',
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 pl-10 pr-10 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink"
                                        />
                                        <KeyRound className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                                            className="absolute right-3 top-2.5 p-0.5 text-muted hover:text-ink"
                                        >
                                            {showCurrentPass ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {passwordForm.errors.current_password && (
                                        <p className="mt-1 text-xs text-sale">
                                            {passwordForm.errors.current_password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="new-password"
                                        className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                    >
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="new-password"
                                            type={showNewPass ? 'text' : 'password'}
                                            value={passwordForm.data.password}
                                            onChange={(e) =>
                                                passwordForm.setData('password', e.target.value)
                                            }
                                            required
                                            className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 pl-10 pr-10 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink"
                                        />
                                        <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPass(!showNewPass)}
                                            className="absolute right-3 top-2.5 p-0.5 text-muted hover:text-ink"
                                        >
                                            {showNewPass ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {passwordForm.errors.password && (
                                        <p className="mt-1 text-xs text-sale">
                                            {passwordForm.errors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirm-new-password"
                                        className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                    >
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirm-new-password"
                                            type="password"
                                            value={passwordForm.data.password_confirmation}
                                            onChange={(e) =>
                                                passwordForm.setData(
                                                    'password_confirmation',
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 pl-10 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink"
                                        />
                                        <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" />
                                    </div>
                                    {passwordForm.errors.password_confirmation && (
                                        <p className="mt-1 text-xs text-sale">
                                            {passwordForm.errors.password_confirmation}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-2 flex items-center justify-between">
                                    <Button
                                        type="submit"
                                        variant="solid"
                                        size="md"
                                        disabled={passwordForm.processing}
                                    >
                                        {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                    </Button>

                                    {passwordForm.recentlySuccessful && (
                                        <span className="text-xs font-medium text-forest flex items-center gap-1">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Password updated
                                        </span>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}

