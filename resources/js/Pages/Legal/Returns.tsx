import StoreLayout from '@/Layouts/StoreLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export default function Returns() {
    const { company } = usePage<PageProps>().props;

    return (
        <StoreLayout>
            <Head title="Returns & Exchanges - EverGrove" />
            <div className="u-container max-w-4xl py-12 lg:py-20">
                <p className="u-label text-forest">30-Day Hassle-Free Policy</p>
                <h1 className="pt-2 font-display text-3xl font-bold uppercase tracking-tight lg:text-4xl text-ink">
                    Returns &amp; Exchanges
                </h1>
                <p className="pt-2 text-sm text-muted">We want you to love what you wear</p>

                <div className="mt-8 border border-forest/20 bg-forest/5 p-6 flex items-start gap-4">
                    <RotateCcw className="h-6 w-6 text-forest shrink-0 mt-1" />
                    <div>
                        <h3 className="font-display font-bold uppercase text-forest text-base">30 Days Return Window</h3>
                        <p className="text-sm text-forest/90 pt-1 leading-relaxed">
                            You have 30 calendar days from delivery to return any unworn, unwashed item with original tags attached for a full refund or size exchange.
                        </p>
                    </div>
                </div>

                <div className="prose prose-neutral max-w-none pt-10 space-y-6 text-[15px] leading-relaxed text-ink/90">
                    <section className="border-b border-line pb-6">
                        <h2 className="font-display text-xl font-bold uppercase text-ink">How to Initiate a Return</h2>
                        <ol className="list-decimal pl-5 pt-2 space-y-2">
                            <li>Send an email to <a href={`mailto:${company?.email || 'info@ever-grove.co.uk'}`} className="text-forest font-semibold underline">{company?.email || 'info@ever-grove.co.uk'}</a> with your Order Number and items to return.</li>
                            <li>Our team will generate and email you a pre-addressed return shipping label within 24 hours.</li>
                            <li>Package the items in their original sustainable packaging and drop the package off at your nearest parcel shop.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold uppercase text-ink">Refund Processing</h2>
                        <p className="pt-2">
                            Once our warehouse inspects the returned items, your refund will be processed back to your original payment card within 3–5 business days.
                        </p>
                    </section>
                </div>
            </div>
        </StoreLayout>
    );
}
