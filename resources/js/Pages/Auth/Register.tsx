import Button from '@/Components/ui/Button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Trees, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Create Account — Evergrove" />

            <div className="border border-line bg-paper p-7 sm:p-10 shadow-sm transition-all duration-300">
                {/* Header */}
                <div className="text-center pb-6 border-b border-line">
                    <p className="u-label text-muted tracking-label mb-2">Evergrove Community</p>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-ink">
                        Create Account
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        Access your orders, track shipments & download tax invoices anytime.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="mt-6 space-y-4">
                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                        >
                            Full Name
                        </label>
                        <div className="relative">
                            <input
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoComplete="name"
                                autoFocus
                                required
                                placeholder="Alex Vance"
                                className="block w-full rounded border border-line bg-surface/40 px-3.5 py-3 pl-10 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
                            />
                            <User
                                className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted"
                                strokeWidth={1.5}
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-xs text-sale font-medium">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                        >
                            Email Address
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
                                className="block w-full rounded border border-line bg-surface/40 px-3.5 py-3 pl-10 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
                            />
                            <Mail
                                className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted"
                                strokeWidth={1.5}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs text-sale font-medium">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                        >
                            Password
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
                                className="block w-full rounded border border-line bg-surface/40 px-3.5 py-3 pl-10 pr-10 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
                            />
                            <Lock
                                className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted"
                                strokeWidth={1.5}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 p-0.5 text-muted hover:text-ink transition-colors"
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
                            <p className="mt-1 text-xs text-sale font-medium">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label
                            htmlFor="password_confirmation"
                            className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
                        >
                            Confirm Password
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
                                placeholder="Repeat your password"
                                className="block w-full rounded border border-line bg-surface/40 px-3.5 py-3 pl-10 pr-10 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-paper focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
                            />
                            <Lock
                                className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted"
                                strokeWidth={1.5}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 p-0.5 text-muted hover:text-ink transition-colors"
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

                    {/* Terms notice */}
                    <p className="text-xs text-muted leading-relaxed pt-1">
                        By creating an account, you agree to Evergrove's{' '}
                        <Link
                            href={route('legal.terms')}
                            className="underline text-ink hover:text-muted"
                        >
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                            href={route('legal.privacy')}
                            className="underline text-ink hover:text-muted"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>

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
                        <span>Encrypted & Private</span>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

