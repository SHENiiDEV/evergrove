import Button from '@/Components/ui/Button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Calendar,
    Eye,
    EyeOff,
    Globe,
    Lock,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Trees,
    User,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface RegisterProps {
    countries?: string[];
}

export default function Register({ countries = [] }: RegisterProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        address_line1: '',
        city: '',
        country: countries.includes('United Kingdom')
            ? 'United Kingdom'
            : countries[0] || 'Germany',
        postal_code: '',
        password: '',
        password_confirmation: '',
        terms: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout maxWidth="max-w-2xl">
            <Head title="Create Customer Account — Evergrove" />

            <div className="border border-line bg-paper p-6 sm:p-10 shadow-sm transition-all duration-300">
                {/* Header */}
                <div className="text-center pb-6 border-b border-line">
                    <p className="u-label text-muted tracking-label mb-2">Member Registration</p>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-ink">
                        Create Account
                    </h1>
                    <p className="mt-2 text-sm text-muted max-w-lg mx-auto">
                        Enjoy express checkout, view real-time tracking, and download tax invoices for all your orders.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="mt-8 space-y-8">
                    {/* SECTION 1: Personal Information */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-line/60">
                            <span className="u-label text-ink">1. Personal Information</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label
                                    htmlFor="first_name"
                                    className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                >
                                    Name <span className="text-sale">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="first_name"
                                        type="text"
                                        name="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        autoComplete="given-name"
                                        autoFocus
                                        required
                                        placeholder="Alex"
                                        className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 pl-10 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
                                    />
                                    <User
                                        className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                {errors.first_name && (
                                    <p className="mt-1 text-xs text-sale font-medium">
                                        {errors.first_name}
                                    </p>
                                )}
                            </div>

                            {/* Last Name (Surname) */}
                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                >
                                    Surname <span className="text-sale">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="last_name"
                                        type="text"
                                        name="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        autoComplete="family-name"
                                        required
                                        placeholder="Vance"
                                        className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 pl-10 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
                                    />
                                    <User
                                        className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                {errors.last_name && (
                                    <p className="mt-1 text-xs text-sale font-medium">
                                        {errors.last_name}
                                    </p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                >
                                    Phone Number <span className="text-sale">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        autoComplete="tel"
                                        required
                                        placeholder="+44 7911 123456"
                                        className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 pl-10 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
                                    />
                                    <Phone
                                        className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-1 text-xs text-sale font-medium">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label
                                    htmlFor="date_of_birth"
                                    className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                >
                                    Date of Birth <span className="text-sale">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="date_of_birth"
                                        type="date"
                                        name="date_of_birth"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        required
                                        className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 pl-10 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
                                    />
                                    <Calendar
                                        className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                {errors.date_of_birth && (
                                    <p className="mt-1 text-xs text-sale font-medium">
                                        {errors.date_of_birth}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Address Details */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-line/60">
                            <span className="u-label text-ink">2. Residential Address</span>
                        </div>

                        <div className="space-y-4">
                            {/* 1. Street, house number, apartment... */}
                            <div>
                                <label
                                    htmlFor="address_line1"
                                    className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                >
                                    1. Street, house number, apartment... <span className="text-sale">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="address_line1"
                                        type="text"
                                        name="address_line1"
                                        value={data.address_line1}
                                        onChange={(e) => setData('address_line1', e.target.value)}
                                        autoComplete="street-address"
                                        required
                                        placeholder="12 High Street, Flat 4B"
                                        className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 pl-10 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
                                    />
                                    <MapPin
                                        className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                {errors.address_line1 && (
                                    <p className="mt-1 text-xs text-sale font-medium">
                                        {errors.address_line1}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* 2. City */}
                                <div>
                                    <label
                                        htmlFor="city"
                                        className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                    >
                                        2. City <span className="text-sale">*</span>
                                    </label>
                                    <input
                                        id="city"
                                        type="text"
                                        name="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        autoComplete="address-level2"
                                        required
                                        placeholder="London"
                                        className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
                                    />
                                    {errors.city && (
                                        <p className="mt-1 text-xs text-sale font-medium">
                                            {errors.city}
                                        </p>
                                    )}
                                </div>

                                {/* 4. Post code */}
                                <div>
                                    <label
                                        htmlFor="postal_code"
                                        className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                    >
                                        4. Post code <span className="text-sale">*</span>
                                    </label>
                                    <input
                                        id="postal_code"
                                        type="text"
                                        name="postal_code"
                                        value={data.postal_code}
                                        onChange={(e) => setData('postal_code', e.target.value)}
                                        autoComplete="postal-code"
                                        required
                                        placeholder="EC1A 1BB"
                                        className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
                                    />
                                    {errors.postal_code && (
                                        <p className="mt-1 text-xs text-sale font-medium">
                                            {errors.postal_code}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* 3. Country (Select with filtered world list) */}
                            <div>
                                <label
                                    htmlFor="country"
                                    className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                >
                                    3. Country <span className="text-sale">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="country"
                                        name="country"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        autoComplete="country-name"
                                        required
                                        className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 pl-10 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors cursor-pointer"
                                    >
                                        {countries.map((countryName) => (
                                            <option key={countryName} value={countryName}>
                                                {countryName}
                                            </option>
                                        ))}
                                    </select>
                                    <Globe
                                        className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                {errors.country && (
                                    <p className="mt-1 text-xs text-sale font-medium">
                                        {errors.country}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Account Credentials */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-line/60">
                            <span className="u-label text-ink">3. Account Credentials</span>
                        </div>

                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                >
                                    Email Address <span className="text-sale">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        autoComplete="username"
                                        required
                                        placeholder="alex@evergrove.co.uk"
                                        className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 pl-10 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
                                    />
                                    <Mail
                                        className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-sale font-medium">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                    >
                                        Password <span className="text-sale">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            autoComplete="new-password"
                                            required
                                            placeholder="At least 8 characters"
                                            className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
                                        />
                                        <Lock
                                            className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted"
                                            strokeWidth={1.5}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-2.5 p-0.5 text-muted hover:text-ink transition-colors"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                                            ) : (
                                                <Eye className="h-4 w-4" strokeWidth={1.5} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-sale font-medium">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                                    >
                                        Confirm Password <span className="text-sale">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData('password_confirmation', e.target.value)
                                            }
                                            autoComplete="new-password"
                                            required
                                            placeholder="Repeat password"
                                            className="block w-full rounded border border-line bg-surface/40 px-3.5 py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
                                        />
                                        <Lock
                                            className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted"
                                            strokeWidth={1.5}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-2.5 p-0.5 text-muted hover:text-ink transition-colors"
                                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                                            ) : (
                                                <Eye className="h-4 w-4" strokeWidth={1.5} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-xs text-sale font-medium">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: Terms & Privacy Agreement */}
                    <div className="pt-2">
                        <label className="flex items-start cursor-pointer select-none gap-3">
                            <input
                                type="checkbox"
                                name="terms"
                                checked={data.terms}
                                onChange={(e) => setData('terms', e.target.checked)}
                                required
                                className="mt-0.5 h-4 w-4 rounded border-line text-ink focus:ring-ink focus:ring-offset-paper shrink-0 cursor-pointer"
                            />
                            <span className="text-xs text-muted leading-relaxed">
                                I agree to the{' '}
                                <Link
                                    href={route('legal.terms')}
                                    target="_blank"
                                    className="font-medium text-ink underline underline-offset-2 hover:text-muted transition-colors"
                                >
                                    Terms &amp; Conditions
                                </Link>{' '}
                                and{' '}
                                <Link
                                    href={route('legal.privacy')}
                                    target="_blank"
                                    className="font-medium text-ink underline underline-offset-2 hover:text-muted transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </span>
                        </label>
                        {errors.terms && (
                            <p className="mt-1.5 text-xs text-sale font-medium">
                                {errors.terms}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="solid"
                            size="lg"
                            fullWidth
                            disabled={processing}
                            className="w-full"
                        >
                            {processing ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </div>
                </form>

                {/* Divider */}
                <div className="my-8 relative text-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-line" />
                    </div>
                    <span className="relative bg-paper px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Already have an account?
                    </span>
                </div>

                {/* Sign In Link */}
                <div>
                    <Button
                        href={route('login')}
                        variant="outline"
                        size="lg"
                        fullWidth
                        className="w-full"
                    >
                        Sign In Instead
                    </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 pt-6 border-t border-line/60 flex items-center justify-center gap-6 text-xs text-muted">
                    <div className="flex items-center gap-1.5">
                        <Trees className="h-3.5 w-3.5 text-forest" strokeWidth={2} />
                        <span>10 Trees / Order</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-ink" strokeWidth={2} />
                        <span>256-bit SSL Encryption</span>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}


