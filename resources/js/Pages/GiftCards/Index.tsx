import Button from '@/Components/ui/Button';
import { useCart } from '@/Context/CartContext';
import StoreLayout from '@/Layouts/StoreLayout';
import { cn } from '@/lib/cn';
import { usePrice } from '@/lib/format';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowRight,
    Check,
    Copy,
    Gift,
    Heart,
    Info,
    Leaf,
    Printer,
    Search,
    ShieldCheck,
    Sparkles,
    TreePine,
} from 'lucide-react';
import React, { FormEvent, useState } from 'react';

interface GiftCardsIndexProps {
    presets: number[];
    defaultAmount: number;
    currency: string;
}

type CardTheme = 'forest' | 'midnight' | 'alpine' | 'earth';

interface ThemeConfig {
    id: CardTheme;
    name: string;
    bgClass: string;
    borderClass: string;
    accentColor: string;
    chipColor: string;
    tagBg: string;
}

const THEMES: Record<CardTheme, ThemeConfig> = {
    forest: {
        id: 'forest',
        name: 'Deep Forest',
        bgClass: 'bg-gradient-to-br from-[#122017] via-[#1E3326] to-[#2F4636] text-[#F7F7F5]',
        borderClass: 'border-[#3E5A47]',
        accentColor: '#88B896',
        chipColor: 'bg-[#C2A368]/90 border-[#E5CA8F]',
        tagBg: 'bg-[#243B2C] text-[#88B896] border-[#3E5A47]',
    },
    midnight: {
        id: 'midnight',
        name: 'Midnight Canopy',
        bgClass: 'bg-gradient-to-br from-[#0F1211] via-[#171B19] to-[#212623] text-[#F7F7F5]',
        borderClass: 'border-[#333A36]',
        accentColor: '#95A59D',
        chipColor: 'bg-[#D1D5DB]/80 border-[#FFFFFF]',
        tagBg: 'bg-[#1C221F] text-[#95A59D] border-[#333A36]',
    },
    alpine: {
        id: 'alpine',
        name: 'Alpine Mist',
        bgClass: 'bg-gradient-to-br from-[#1C2826] via-[#2A3B37] to-[#3B4E49] text-[#F7F7F5]',
        borderClass: 'border-[#4A635D]',
        accentColor: '#A3CCC3',
        chipColor: 'bg-[#B0C4DE]/90 border-[#D8E6F3]',
        tagBg: 'bg-[#2E413D] text-[#A3CCC3] border-[#4A635D]',
    },
    earth: {
        id: 'earth',
        name: 'Terracotta Earth',
        bgClass: 'bg-gradient-to-br from-[#331A14] via-[#4A261D] to-[#63352A] text-[#F7F7F5]',
        borderClass: 'border-[#7D4638]',
        accentColor: '#E29A86',
        chipColor: 'bg-[#E5A869]/90 border-[#F3CCA4]',
        tagBg: 'bg-[#47251E] text-[#E29A86] border-[#7D4638]',
    },
};

interface GeneratedCard {
    code: string;
    amount: number;
    recipient_name?: string | null;
    recipient_email?: string | null;
    sender_name?: string | null;
    message?: string | null;
    theme: CardTheme;
    expires_at: string;
}

export default function GiftCardsIndex({
    presets = [25, 50, 100, 150, 250, 500],
    defaultAmount = 100,
}: GiftCardsIndexProps) {
    const { shop, company } = usePage<PageProps>().props;
    const { applyCoupon, openCart } = useCart();
    const price = usePrice();

    // Form states
    const [selectedAmount, setSelectedAmount] = useState<number>(defaultAmount);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [isCustom, setIsCustom] = useState<boolean>(false);
    const [theme, setTheme] = useState<CardTheme>('forest');

    const [recipientName, setRecipientName] = useState<string>('');
    const [recipientEmail, setRecipientEmail] = useState<string>('');
    const [senderName, setSenderName] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    // Generation states
    const [loading, setLoading] = useState(false);
    const [generatedCard, setGeneratedCard] = useState<GeneratedCard | null>(null);
    const [copied, setCopied] = useState(false);
    const [appliedToCart, setAppliedToCart] = useState(false);

    // Balance Checker states
    const [checkCode, setCheckCode] = useState('');
    const [checkLoading, setCheckLoading] = useState(false);
    const [balanceResult, setBalanceResult] = useState<any>(null);
    const [balanceError, setBalanceError] = useState<string | null>(null);

    const activeAmount = isCustom
        ? parseFloat(customAmount) || 0
        : selectedAmount;

    const currentTheme = THEMES[theme];

    const handleGenerate = async (e: FormEvent) => {
        e.preventDefault();
        if (activeAmount < 5) {
            alert('Minimum gift card amount is €5.00');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('/gift-cards/generate', {
                amount: activeAmount,
                recipient_name: recipientName.trim() || null,
                recipient_email: recipientEmail.trim() || null,
                sender_name: senderName.trim() || null,
                message: message.trim() || null,
                theme,
            });

            if (res.data?.success) {
                setGeneratedCard(res.data.gift_card);
                // Scroll to result on mobile
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to generate gift card.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleApplyToCart = async (code: string) => {
        const success = await applyCoupon(code);
        if (success) {
            setAppliedToCart(true);
            openCart();
        }
    };

    const handleCheckBalance = async (e: FormEvent) => {
        e.preventDefault();
        if (!checkCode.trim()) return;

        setCheckLoading(true);
        setBalanceError(null);
        setBalanceResult(null);

        try {
            const res = await axios.post('/gift-cards/balance', {
                code: checkCode.trim(),
            });
            setBalanceResult(res.data);
        } catch (err: any) {
            setBalanceError(
                err.response?.data?.message || 'Card not found or inactive.'
            );
        } finally {
            setCheckLoading(false);
        }
    };

    return (
        <StoreLayout>
            <Head title="Digital Gift Cards — EverGrove" />

            {/* Header / Hero */}
            <div className="border-b border-line bg-surface/30 py-12 lg:py-16">
                <div className="u-container max-w-5xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-forest">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>The Perfect Earth-First Present</span>
                    </div>

                    <h1 className="pt-4 font-display text-3xl font-bold uppercase tracking-tight sm:text-5xl text-ink">
                        EverGrove Digital Gift Card
                    </h1>

                    <p className="mx-auto max-w-2xl pt-3 text-sm leading-relaxed text-muted sm:text-base">
                        Give timeless apparel crafted with Hemp, Organic Cotton &amp; TENCEL™. Every gift card purchase funds the planting of <strong>10 trees</strong> worldwide.
                    </p>
                </div>
            </div>

            <div className="u-container max-w-6xl py-12 lg:py-16">
                <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
                    {/* Left Column: Live Card Preview (5 Cols) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
                        <div>
                            <p className="u-label pb-3 text-muted">Live Card Preview</p>

                            {/* Digital Card Graphic */}
                            <div
                                className={cn(
                                    'relative aspect-[1.58/1] w-full rounded-2xl p-6 sm:p-7 shadow-2xl border transition-all duration-500 overflow-hidden flex flex-col justify-between select-none',
                                    currentTheme.bgClass,
                                    currentTheme.borderClass
                                )}
                            >
                                {/* Decorative Texture & Rings */}
                                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
                                <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/5" />
                                <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full border border-white/5" />

                                {/* Card Header */}
                                <div className="flex items-start justify-between relative z-10">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <TreePine className="h-5 w-5 text-emerald-400" />
                                            <span className="font-display text-xl font-black uppercase tracking-widest">
                                                {shop.name}
                                            </span>
                                        </div>
                                        <p className="text-[10px] uppercase tracking-widest text-white/70 font-semibold pt-0.5">
                                            Earth-First Apparel
                                        </p>
                                    </div>

                                    {/* Chip & Badge */}
                                    <div className="flex items-center gap-2">
                                        <div className={cn('h-7 w-9 rounded border flex items-center justify-center shadow-inner', currentTheme.chipColor)}>
                                            <div className="w-5 h-3.5 border border-black/20 rounded-sm grid grid-cols-2 gap-0.5 p-0.5 opacity-60">
                                                <div className="bg-black/20 rounded-xs" />
                                                <div className="bg-black/20 rounded-xs" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Value Center */}
                                <div className="my-auto pt-2 relative z-10">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">
                                        Gift Card Balance
                                    </span>
                                    <p className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-white drop-shadow-sm">
                                        €{activeAmount > 0 ? activeAmount.toFixed(2) : '0.00'}
                                    </p>

                                    {recipientName && (
                                        <p className="pt-1 text-xs text-white/90 font-medium truncate">
                                            For: <strong className="text-white">{recipientName}</strong>
                                        </p>
                                    )}
                                </div>

                                {/* Card Footer & Code */}
                                <div className="relative z-10 pt-2 border-t border-white/10 flex items-end justify-between">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-white/50">Redeemable Code</p>
                                        <p className="font-mono text-xs sm:text-sm tracking-wider font-bold text-white/95">
                                            {generatedCard ? generatedCard.code : 'EVG-GIFT-••••-••••'}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300 border border-white/10">
                                            🌲 10 Trees
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Message Preview Box */}
                        {message && (
                            <div className="rounded-xl border border-line bg-surface/50 p-4 text-xs leading-relaxed text-ink/80 space-y-1">
                                <p className="font-bold text-ink uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                    <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                                    Gift Message:
                                </p>
                                <p className="italic text-muted">"{message}"</p>
                                {senderName && <p className="text-right font-medium text-ink">— {senderName}</p>}
                            </div>
                        )}

                        {/* Guarantee Note */}
                        <div className="flex items-start gap-3 rounded-lg border border-line p-4 text-xs text-muted">
                            <ShieldCheck className="h-4 w-4 shrink-0 text-forest mt-0.5" />
                            <p>
                                <strong>EverGrove Lifetime Guarantee:</strong> Digital gift cards never expire and can be redeemed on any product or sale across the entire catalog.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Configuration & Generator Form (7 Cols) */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Issued / Success Banner State */}
                        {generatedCard && (
                            <div className="rounded-xl border-2 border-forest bg-forest/5 p-6 sm:p-8 space-y-6 animate-scale-in">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="grid h-10 w-10 place-items-center rounded-full bg-forest text-white shadow">
                                            <Check className="h-5 w-5" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="font-display text-lg font-bold uppercase text-ink">
                                                Gift Card Issued Successfully!
                                            </h3>
                                            <p className="text-xs text-muted">
                                                Ready to use instantly on checkout or in the cart.
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-display text-2xl font-black text-forest">
                                        €{generatedCard.amount.toFixed(2)}
                                    </span>
                                </div>

                                {/* Code Box */}
                                <div className="rounded-lg border border-line bg-paper p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Your Redeemable Gift Code</span>
                                        <p className="font-mono text-xl font-bold tracking-widest text-ink select-all">
                                            {generatedCard.code}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleCopy(generatedCard.code)}
                                        className={cn(
                                            'flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded shadow-sm',
                                            copied
                                                ? 'bg-forest text-white'
                                                : 'bg-ink text-paper hover:bg-ink/90'
                                        )}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                Code Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                Copy Code
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={() => handleApplyToCart(generatedCard.code)}
                                        className="flex h-11 items-center justify-center gap-2 rounded bg-forest px-4 text-xs font-bold uppercase tracking-wider text-white shadow transition-colors hover:bg-forest/90"
                                    >
                                        <Gift className="h-4 w-4" />
                                        {appliedToCart ? 'Applied to Cart ✓' : 'Apply to Cart Now'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => window.print()}
                                        className="flex h-11 items-center justify-center gap-2 rounded border border-line bg-paper px-4 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-surface"
                                    >
                                        <Printer className="h-4 w-4" />
                                        Print / Save Card
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Generator Form */}
                        <form onSubmit={handleGenerate} className="space-y-8 border border-line bg-surface/30 p-6 sm:p-8">
                            {/* Step 1: Select Denomination */}
                            <div>
                                <label className="block u-label text-ink pb-3">
                                    1. Choose Card Amount (EUR €)
                                </label>
                                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                                    {presets.map((amt) => {
                                        const active = !isCustom && selectedAmount === amt;
                                        return (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedAmount(amt);
                                                    setIsCustom(false);
                                                }}
                                                className={cn(
                                                    'h-12 border text-sm font-bold transition-all rounded-none',
                                                    active
                                                        ? 'border-ink bg-ink text-paper shadow-sm'
                                                        : 'border-line bg-paper text-ink hover:border-ink'
                                                )}
                                            >
                                                €{amt}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom Amount Input */}
                                <div className="mt-3 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCustom(true)}
                                        className={cn(
                                            'text-xs font-semibold uppercase tracking-wider border px-3 py-2 transition-colors',
                                            isCustom ? 'border-ink bg-ink text-paper' : 'border-line text-muted hover:text-ink'
                                        )}
                                    >
                                        Custom Amount:
                                    </button>
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-2.5 text-sm font-bold text-muted">€</span>
                                        <input
                                            type="number"
                                            min="5"
                                            max="5000"
                                            step="1"
                                            placeholder="Enter any amount (e.g. 75)"
                                            value={customAmount}
                                            onFocus={() => setIsCustom(true)}
                                            onChange={(e) => {
                                                setCustomAmount(e.target.value);
                                                setIsCustom(true);
                                            }}
                                            className="h-10 w-full border border-line bg-paper pl-8 pr-3 text-sm font-bold text-ink focus:border-ink focus:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Choose Design Theme */}
                            <div className="border-t border-line pt-6">
                                <label className="block u-label text-ink pb-3">
                                    2. Select Card Style Theme
                                </label>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {(Object.keys(THEMES) as CardTheme[]).map((tKey) => {
                                        const t = THEMES[tKey];
                                        const active = theme === tKey;
                                        return (
                                            <button
                                                key={tKey}
                                                type="button"
                                                onClick={() => setTheme(tKey)}
                                                className={cn(
                                                    'flex flex-col items-center gap-2 border p-3 text-center transition-all',
                                                    active
                                                        ? 'border-ink bg-ink/5 shadow-xs'
                                                        : 'border-line bg-paper hover:border-ink/50'
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'h-8 w-full rounded border',
                                                        t.bgClass,
                                                        t.borderClass
                                                    )}
                                                />
                                                <span className="text-xs font-semibold uppercase tracking-wide text-ink">
                                                    {t.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Step 3: Personalize Details */}
                            <div className="border-t border-line pt-6 space-y-4">
                                <label className="block u-label text-ink">
                                    3. Personalize Gift Details (Optional)
                                </label>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs uppercase font-semibold text-muted pb-1.5">
                                            Recipient Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Emma Watson"
                                            value={recipientName}
                                            onChange={(e) => setRecipientName(e.target.value)}
                                            className="h-11 w-full border border-line bg-paper px-3 text-sm focus:border-ink focus:ring-0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase font-semibold text-muted pb-1.5">
                                            Recipient Email (Optional Delivery)
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="emma@example.com"
                                            value={recipientEmail}
                                            onChange={(e) => setRecipientEmail(e.target.value)}
                                            className="h-11 w-full border border-line bg-paper px-3 text-sm focus:border-ink focus:ring-0"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs uppercase font-semibold text-muted pb-1.5">
                                            Your Name (Sender)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Alex"
                                            value={senderName}
                                            onChange={(e) => setSenderName(e.target.value)}
                                            className="h-11 w-full border border-line bg-paper px-3 text-sm focus:border-ink focus:ring-0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase font-semibold text-muted pb-1.5">
                                            Personal Message / Note
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Happy Birthday! Enjoy the fresh outdoors 🌲"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="h-11 w-full border border-line bg-paper px-3 text-sm focus:border-ink focus:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Generator Button */}
                            <div className="border-t border-line pt-6">
                                <Button
                                    type="submit"
                                    size="lg"
                                    fullWidth
                                    disabled={loading || activeAmount < 5}
                                >
                                    {loading ? (
                                        'Generating Gift Card Code...'
                                    ) : (
                                        <>
                                            Generate Digital Gift Card — €{activeAmount.toFixed(2)}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                                <p className="pt-2 text-center text-[11px] text-muted">
                                    Instant redemption code issued immediately. 10 trees planted with this card.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Section: Check Existing Gift Card Balance */}
                <div className="mt-20 border-t border-line pt-16">
                    <div className="mx-auto max-w-xl text-center">
                        <h2 className="font-display text-2xl font-bold uppercase text-ink">
                            Check Gift Card Balance
                        </h2>
                        <p className="pt-2 text-sm text-muted">
                            Have an EverGrove gift card or code? Enter it below to check current balance and validity.
                        </p>

                        <form onSubmit={handleCheckBalance} className="mt-6 flex gap-2">
                            <input
                                type="text"
                                required
                                placeholder="EVG-GIFT-XXXX-XXXX"
                                value={checkCode}
                                onChange={(e) => setCheckCode(e.target.value)}
                                className="h-12 flex-1 border border-line bg-paper px-4 font-mono text-sm uppercase tracking-wider focus:border-ink focus:ring-0"
                            />
                            <Button type="submit" size="lg" disabled={checkLoading}>
                                {checkLoading ? 'Checking...' : 'Check Balance'}
                            </Button>
                        </form>

                        {/* Balance Result Display */}
                        {balanceResult && (
                            <div className="mt-6 rounded-lg border border-forest/30 bg-forest/5 p-5 text-left space-y-2 animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono font-bold text-ink text-sm">{balanceResult.code}</span>
                                    <span className="font-display text-xl font-bold text-forest">
                                        €{Number(balanceResult.balance).toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-xs text-muted">
                                    Status: <strong className="text-forest">Active &amp; Redeemable</strong> • Expires: {balanceResult.expires_at}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleApplyToCart(balanceResult.code)}
                                    className="mt-2 text-xs font-bold uppercase tracking-wider text-forest underline hover:text-ink"
                                >
                                    Apply this code to cart now →
                                </button>
                            </div>
                        )}

                        {balanceError && (
                            <p className="mt-4 text-xs font-semibold text-rose-600">
                                {balanceError}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
