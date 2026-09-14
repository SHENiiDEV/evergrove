import StoreLayout from '@/Layouts/StoreLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Clock, ShieldCheck, TreePine, Truck } from 'lucide-react';

export default function Shipping() {
    const { company } = usePage<PageProps>().props;

    return (
        <StoreLayout>
            <Head title="Shipping & Delivery - EverGrove" />
            <div className="u-container max-w-4xl py-12 lg:py-20">
                <p className="u-label text-forest">Fulfillment & Delivery</p>
                <h1 className="pt-2 font-display text-3xl font-bold uppercase tracking-tight lg:text-4xl text-ink">
                    Shipping &amp; Delivery Information
                </h1>
                <p className="pt-2 text-sm text-muted">Carbon-neutral delivery across the European Union &amp; UK</p>

                <div className="grid gap-6 pt-8 sm:grid-cols-3">
                    <div className="border border-line p-5 bg-surface/30">
                        <Truck className="h-6 w-6 text-forest mb-2" />
                        <h3 className="font-display font-bold uppercase text-sm">EU Tracked Delivery</h3>
                        <p className="text-xs text-muted pt-1">3–7 business days to all 27 EU member states.</p>
                    </div>
                    <div className="border border-line p-5 bg-surface/30">
                        <Clock className="h-6 w-6 text-forest mb-2" />
                        <h3 className="font-display font-bold uppercase text-sm">Free Over €100</h3>
                        <p className="text-xs text-muted pt-1">Orders under €100 ship for a flat €4.95 standard rate.</p>
                    </div>
                    <div className="border border-line p-5 bg-surface/30">
                        <TreePine className="h-6 w-6 text-forest mb-2" />
                        <h3 className="font-display font-bold uppercase text-sm">10 Trees Every Order</h3>
                        <p className="text-xs text-muted pt-1">Reforestation offsets all transport emissions.</p>
                    </div>
                </div>

                <div className="prose prose-neutral max-w-none pt-10 space-y-6 text-[15px] leading-relaxed text-ink/90">
                    <section className="border-b border-line pb-6">
                        <h2 className="font-display text-xl font-bold uppercase text-ink">Order Dispatch &amp; Tracking</h2>
                        <p className="pt-2">
                            All orders placed with <strong>{company?.name || 'EverGrove'}</strong> are packed in 100% plastic-free, biodegradable paper mailers and dispatched from our European fulfillment centers within 24 hours (Monday to Friday).
                        </p>
                        <p className="pt-2">
                            Once your order has been handed over to the courier, you will receive an automatic dispatch email with tracking links to monitor your parcel in real-time.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold uppercase text-ink">Customer Inquiries</h2>
                        <p className="pt-2">
                            Need help with a delivery? Reach out to our logistics desk at <a href={`mailto:${company?.email || 'info@ever-grove.co.uk'}`} className="text-forest underline font-semibold">{company?.email || 'info@ever-grove.co.uk'}</a> with your order number.
                        </p>
                    </section>
                </div>
            </div>
        </StoreLayout>
    );
}
