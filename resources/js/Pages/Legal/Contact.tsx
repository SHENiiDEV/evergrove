import Button from '@/Components/ui/Button';
import StoreLayout from '@/Layouts/StoreLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircle2, Mail, MapPin, MessageSquare, Phone, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';

export default function Contact() {
    const { company } = usePage<PageProps>().props;
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <StoreLayout>
            <Head title="Contact Us - EverGrove" />
            <div className="u-container max-w-5xl py-12 lg:py-20">
                <p className="u-label text-forest">Get In Touch</p>
                <h1 className="pt-2 font-display text-3xl font-bold uppercase tracking-tight lg:text-4xl text-ink">
                    Contact Customer Care
                </h1>
                <p className="pt-2 text-sm text-muted">We typically respond within 24 business hours.</p>

                <div className="grid gap-12 pt-10 lg:grid-cols-2">
                    {/* Left: Contact Form */}
                    <div className="border border-line bg-surface/30 p-8">
                        {sent ? (
                            <div className="py-12 text-center space-y-4">
                                <CheckCircle2 className="h-12 w-12 text-forest mx-auto" />
                                <h3 className="font-display text-xl font-bold uppercase text-ink">Message Received!</h3>
                                <p className="text-sm text-muted max-w-sm mx-auto">
                                    Thank you for reaching out. Our support team has received your message and will reply to your email shortly.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs uppercase font-bold tracking-wider text-ink pb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Alex Vance"
                                        className="w-full border border-line bg-paper px-4 py-3 text-sm focus:border-ink focus:ring-0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold tracking-wider text-ink pb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="alex@example.com"
                                        className="w-full border border-line bg-paper px-4 py-3 text-sm focus:border-ink focus:ring-0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold tracking-wider text-ink pb-2">Order Number (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="EVG-2026-XXXXX"
                                        className="w-full border border-line bg-paper px-4 py-3 text-sm focus:border-ink focus:ring-0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold tracking-wider text-ink pb-2">Message</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="How can we help you today?"
                                        className="w-full border border-line bg-paper px-4 py-3 text-sm focus:border-ink focus:ring-0"
                                    />
                                </div>
                                <Button type="submit" size="lg" fullWidth>
                                    Send Message
                                </Button>
                            </form>
                        )}
                    </div>

                    {/* Right: Company Contact Details */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="font-display text-xl font-bold uppercase text-ink">Company Information</h2>
                            <p className="pt-2 text-sm text-muted">
                                EverGrove is committed to earth-first apparel and ethical operations.
                            </p>
                        </div>

                        <div className="space-y-6 border-t border-line pt-6">
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-forest shrink-0 mt-1" />
                                <div>
                                    <p className="text-xs uppercase font-bold tracking-wider text-muted">Email Support</p>
                                    <a href={`mailto:${company?.email || 'info@ever-grove.co.uk'}`} className="text-base font-semibold text-ink hover:underline">
                                        {company?.email || 'info@ever-grove.co.uk'}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <ShieldCheck className="h-5 w-5 text-forest shrink-0 mt-1" />
                                <div>
                                    <p className="text-xs uppercase font-bold tracking-wider text-muted">Registered Legal Entity</p>
                                    <p className="text-sm font-semibold text-ink">{company?.name || 'EverGrove Retail Ltd'}</p>
                                    <p className="text-xs text-muted">Company Registration: <span className="font-mono">{company?.number || '14892341'}</span></p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-forest shrink-0 mt-1" />
                                <div>
                                    <p className="text-xs uppercase font-bold tracking-wider text-muted">Registered Address</p>
                                    <p className="text-sm text-ink leading-relaxed">
                                        {company?.address || '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
