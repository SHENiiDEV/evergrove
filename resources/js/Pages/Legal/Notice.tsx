import StoreLayout from '@/Layouts/StoreLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Mail, MapPin, ShieldCheck } from 'lucide-react';

export default function Notice() {
    const { company } = usePage<PageProps>().props;

    return (
        <StoreLayout>
            <Head title="Legal Notice & Impressum - EverGrove" />
            <div className="u-container max-w-4xl py-12 lg:py-20">
                <p className="u-label text-forest">Corporate Information</p>
                <h1 className="pt-2 font-display text-3xl font-bold uppercase tracking-tight lg:text-4xl text-ink">
                    Legal Notice &amp; Impressum
                </h1>
                <p className="pt-2 text-sm text-muted">Information pursuant to statutory disclosure requirements</p>

                <div className="mt-8 border border-line bg-surface/30 p-8 space-y-6">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="h-6 w-6 text-forest shrink-0 mt-0.5" />
                        <div>
                            <h2 className="font-display text-lg font-bold uppercase text-ink">Company Entity</h2>
                            <p className="text-base text-ink pt-1 font-semibold">{company?.name || 'EverGrove Retail Ltd'}</p>
                            <p className="text-sm text-muted">Company Registration Number: <span className="font-mono text-ink">{company?.number || '14892341'}</span></p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-line pt-6">
                        <MapPin className="h-6 w-6 text-forest shrink-0 mt-0.5" />
                        <div>
                            <h2 className="font-display text-lg font-bold uppercase text-ink">Registered Office Address</h2>
                            <p className="text-sm text-ink pt-1 leading-relaxed">
                                {company?.address || '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-line pt-6">
                        <Mail className="h-6 w-6 text-forest shrink-0 mt-0.5" />
                        <div>
                            <h2 className="font-display text-lg font-bold uppercase text-ink">Contact &amp; Electronic Communication</h2>
                            <p className="text-sm text-ink pt-1">
                                Email: <a href={`mailto:${company?.email || 'info@ever-grove.co.uk'}`} className="text-forest font-semibold underline">{company?.email || 'info@ever-grove.co.uk'}</a>
                            </p>
                            <p className="text-xs text-muted pt-1">Online Store: https://ever-grove.co.uk</p>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
