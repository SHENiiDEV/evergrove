import StoreLayout from '@/Layouts/StoreLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Terms() {
    const { company, shop } = usePage<PageProps>().props;

    return (
        <StoreLayout>
            <Head title="Terms of Use - EverGrove" />
            <div className="u-container max-w-4xl py-12 lg:py-20">
                <p className="u-label text-forest">Legal Documentation</p>
                <h1 className="pt-2 font-display text-3xl font-bold uppercase tracking-tight lg:text-4xl text-ink">
                    Terms of Use &amp; Service
                </h1>
                <p className="pt-2 text-sm text-muted">Last updated: September 2026</p>

                <div className="prose prose-neutral max-w-none pt-8 space-y-8 text-[15px] leading-relaxed text-ink/90">
                    <section className="border-b border-line pb-6">
                        <h2 className="font-display text-xl font-bold uppercase text-ink">1. About EverGrove</h2>
                        <p className="pt-2">
                            These Terms of Service govern your use of the website <strong>https://ever-grove.co.uk</strong> and any purchases made from <strong>{company?.name || 'EverGrove Retail Ltd'}</strong> (Company Registration No: <strong>{company?.number || '14892341'}</strong>), with registered address at <strong>{company?.address || '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom'}</strong>.
                        </p>
                        <p className="pt-2">
                            For any inquiries, you may reach our legal and customer team at <a href={`mailto:${company?.email || 'info@ever-grove.co.uk'}`} className="text-forest underline">{company?.email || 'info@ever-grove.co.uk'}</a>.
                        </p>
                    </section>

                    <section className="border-b border-line pb-6">
                        <h2 className="font-display text-xl font-bold uppercase text-ink">2. Orders &amp; Contract Formation</h2>
                        <p className="pt-2">
                            By placing an order through our checkout, you are offering to purchase a product subject to these terms. All orders are subject to availability and confirmation of the order price.
                        </p>
                        <p className="pt-2">
                            When you submit an order, you will receive an acknowledgement email confirming receipt of your order and payment. A binding contract is formed upon dispatch of your goods.
                        </p>
                    </section>

                    <section className="border-b border-line pb-6">
                        <h2 className="font-display text-xl font-bold uppercase text-ink">3. Pricing, Currency &amp; Taxes</h2>
                        <p className="pt-2">
                            All prices displayed on {shop.name} are quoted in Euros (EUR €) or applicable local currency and include applicable VAT. Shipping costs are calculated and clearly itemized at checkout before final confirmation.
                        </p>
                    </section>

                    <section className="border-b border-line pb-6">
                        <h2 className="font-display text-xl font-bold uppercase text-ink">4. Tree Planting Promise</h2>
                        <p className="pt-2">
                            For every product purchased on EverGrove, 10 certified trees are funded and planted in partnership with verified global reforestation projects.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold uppercase text-ink">5. Governing Law</h2>
                        <p className="pt-2">
                            These Terms of Service and any separate agreements shall be governed by and construed in accordance with the laws of the United Kingdom and applicable European Union consumer regulations.
                        </p>
                    </section>
                </div>
            </div>
        </StoreLayout>
    );
}
