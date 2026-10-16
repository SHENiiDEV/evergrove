import Button from '@/Components/ui/Button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Trees } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign In — Evergrove" />

            <div className="border border-line bg-paper p-7 sm:p-10 shadow-sm transition-all duration-300">
                {/* Header */}
                <div className="text-center pb-6 border-b border-line">
                    <p className="u-label text-muted tracking-label mb-2">Customer Account</p>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-ink">
                        Sign In
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        Track orders, view real-time shipments & download tax invoices.
                    </p>
                </div>

                {/* Status alert */}
                {status && (
                    <div className="mt-5 rounded border border-forest/20 bg-forest/5 p-3 text-sm text-forest text-center font-medium">
                        {status}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={submit} className="mt-6 space-y-5">
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
                                autoFocus
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
                            <p className="mt-1.5 text-xs text-sale font-medium">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label
                                htmlFor="password"
                                className="block text-xs font-semibold uppercase tracking-wider text-ink"
                            >
                                Password
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs text-muted hover:text-ink transition-colors underline-offset-4 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="current-password"
                                required
                                placeholder="••••••••••••"
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
                            <p className="mt-1.5 text-xs text-sale font-medium">{errors.password}</p>
                        )}
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 rounded border-line text-ink focus:ring-ink focus:ring-offset-paper"
                            />
                            <span className="ml-2 text-xs text-muted">
                                Keep me signed in
                            </span>
                        </label>
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
                            {processing ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </div>
                </form>

                {/* Divider */}
                <div className="my-8 relative text-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-line" />
                    </div>
                    <span className="relative bg-paper px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                        New to Evergrove?
                    </span>
                </div>

                {/* Create Account Link */}
                <div>
                    <Button
                        href={route('register')}
                        variant="outline"
                        size="lg"
                        fullWidth
                        className="w-full"
                    >
                        Create an Account
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
                        <span>Secure Account</span>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

