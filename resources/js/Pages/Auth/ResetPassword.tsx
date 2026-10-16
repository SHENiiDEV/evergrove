import Button from '@/Components/ui/Button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Set New Password — Evergrove" />

            <div className="border border-line bg-paper p-7 sm:p-10 shadow-sm transition-all duration-300">
                {/* Header */}
                <div className="text-center pb-6 border-b border-line">
                    <p className="u-label text-muted tracking-label mb-2">Security</p>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-ink">
                        New Password
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        Please enter your account email and choose a strong new password.
                    </p>
                </div>

                <form onSubmit={submit} className="mt-6 space-y-4">
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
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="new-password"
                                autoFocus
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
                            Confirm New Password
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
                                placeholder="Repeat your new password"
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

                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="solid"
                            size="lg"
                            fullWidth
                            disabled={processing}
                            className="w-full"
                        >
                            {processing ? 'Saving New Password...' : 'Save Password'}
                        </Button>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}

