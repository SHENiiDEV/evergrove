import Button from '@/Components/ui/Button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password — Evergrove" />

            <div className="border border-line bg-paper p-7 sm:p-10 shadow-sm transition-all duration-300">
                {/* Header */}
                <div className="text-center pb-6 border-b border-line">
                    <p className="u-label text-muted tracking-label mb-2">Password Recovery</p>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-ink">
                        Reset Password
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        Enter your email address and we will send you a secure link to reset your account password.
                    </p>
                </div>

                {status && (
                    <div className="mt-5 rounded border border-forest/20 bg-forest/5 p-3 text-sm text-forest text-center font-medium">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="mt-6 space-y-5">
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

                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="solid"
                            size="lg"
                            fullWidth
                            disabled={processing}
                            className="w-full"
                        >
                            {processing ? 'Sending Link...' : 'Email Reset Link'}
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Return to Sign In</span>
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}

