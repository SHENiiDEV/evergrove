import StoreLayout from '@/Layouts/StoreLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Privacy() {
    const { company } = usePage<PageProps>().props;

    return (
        <StoreLayout>
            <Head title="Privacy Policy - EverGrove" />
            <div className="u-container max-w-4xl py-12 lg:py-20">
                <p className="u-label text-forest">Privacy &amp; GDPR Compliance</p>
                <h1 className="pt-2 font-display text-3xl font-bold uppercase tracking-tight lg:text-4xl text-ink">
                    Privacy Policy
                </h1>
                <p className="pt-2 text-sm text-muted">Effective date: September 2026</p>

                <div className="prose prose-neutral max-w-none pt-8 space-y-8 text-[15px] leading-relaxed text-ink/90">
                    <section className="border-b border-line pb-6">
                        <h2 className="font-display text-xl font-bold uppercase text-ink">1. Data Controller</h2>
                        <p className="pt-2">
                            The data controller responsible for your personal information is <strong>{company?.name || 'EverGrove Retail Ltd'}</strong> (Registration No: <strong>{company?.number || '14892341'}</strong>), located at <strong>{company?.address || '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom'}</strong>. Contact email: <a href={`mailto:${company?.email || 'info@ever-grove.co.uk'}`} className="text-forest underline">{company?.email || 'info@ever-grove.co.uk'}</a>.
                        </p>
                    </section>

                    <section className="border-b border-line pb-6">
                        <h2 className="font-display text-xl font-bold uppercase text-ink">2. Information We Collect</h2>
                        <p className="pt-2">
                            When you place an order or contact us, we collect information strictly necessary to fulfill your request:
                        </p>
                        <ul className="list-disc pl-5 pt-2 space-y-1">
                            <li>Name, delivery address, email address, and telephone number for shipping.</li>
                            <li>Order history and chosen payment methods.</li>
                            <li>Technical logs and cookie preferences for site performance and security.</li>
                        </ul>
                    </section>

                    <section className="border-b border-line pb-6">
                        <h2 className="font-display text-xl font-bold uppercase text-ink">3. How We Use Your Data</h2>
                        <p className="pt-2">
                            We use your data solely to process orders, communicate shipment updates, provide customer support, and comply with tax and legal requirements. We do not sell your personal data to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold uppercase text-ink">4. Your GDPR Rights</h2>
                        <p className="pt-2">
                            Under UK and EU GDPR, you have the right to access, rectify, or erase your personal data at any time. To exercise these rights, please email us at <a href={`mailto:${company?.email || 'info@ever-grove.co.uk'}`} className="text-forest underline">{company?.email || 'info@ever-grove.co.uk'}</a>.
                        </p>
                    </section>
                </div>
            </div>
        </StoreLayout>
    );
}
