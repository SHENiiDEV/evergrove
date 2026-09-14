import StoreLayout from '@/Layouts/StoreLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Refund() {
    const { company } = usePage<PageProps>().props;

    return (
        <StoreLayout>
            <Head title="Refund Policy - EverGrove" />
            <div className="u-container max-w-4xl py-12 lg:py-20">
                <p className="u-label text-forest">Consumer Protection</p>
                <h1 className="pt-2 font-display text-3xl font-bold uppercase tracking-tight lg:text-4xl text-ink">
                    Refund &amp; Cancellation Policy
                </h1>
                <p className="pt-2 text-sm text-muted">Clear and transparent consumer refund terms</p>

                <div className="prose prose-neutral max-w-none pt-8 space-y-6 text-[15px] leading-relaxed text-ink/90">
                    <section className="border-b border-line pb-6">
                        <h2 className="font-display text-xl font-bold uppercase text-ink">1. Right of Withdrawal (14-Day EU Statutory Period)</h2>
                        <p className="pt-2">
                            In accordance with European Union consumer law, customers have the right to withdraw from their purchase contract within 14 days without giving any reason. In addition, <strong>{company?.name || 'EverGrove'}</strong> extends this period to a total of <strong>30 days</strong>.
                        </p>
                    </section>

                    <section className="border-b border-line pb-6">
                        <h2 className="font-display text-xl font-bold uppercase text-ink">2. Reimbursement Method</h2>
                        <p className="pt-2">
                            We will reimburse all payments received from you, including initial standard delivery costs, using the same payment method you used for the initial transaction. You will not incur any processing fees for such reimbursement.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold uppercase text-ink">3. Contact for Refund Requests</h2>
                        <p className="pt-2">
                            To request a refund or status update on your return, contact our accounting department at <a href={`mailto:${company?.email || 'info@ever-grove.co.uk'}`} className="text-forest underline font-semibold">{company?.email || 'info@ever-grove.co.uk'}</a>.
                        </p>
                    </section>
                </div>
            </div>
        </StoreLayout>
    );
}
