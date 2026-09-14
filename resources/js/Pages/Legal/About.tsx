import StoreLayout from '@/Layouts/StoreLayout';
import { Head } from '@inertiajs/react';
import { TreePine, Sparkles, HeartHandshake, Leaf } from 'lucide-react';

export default function About() {
    return (
        <StoreLayout>
            <Head title="Our Story - EverGrove" />
            <div className="u-container max-w-4xl py-12 lg:py-20">
                <p className="u-label text-forest">The EverGrove Mission</p>
                <h1 className="pt-2 font-display text-3xl font-bold uppercase tracking-tight lg:text-5xl text-ink">
                    Earth-First Apparel for a Greener Tomorrow
                </h1>

                <div className="mt-8 relative aspect-video overflow-hidden border border-line bg-surface">
                    <img 
                        src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1600&q=80" 
                        alt="Forest Canopy" 
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="prose prose-neutral max-w-none pt-10 space-y-8 text-[16px] leading-relaxed text-ink/90">
                    <section>
                        <h2 className="font-display text-2xl font-bold uppercase text-ink">Every Item Plants 10 Trees</h2>
                        <p className="pt-3">
                            At EverGrove, we believe that style should not come at the expense of our planet. For every sweater, hoodie, shirt, and accessory purchased, we fund and plant 10 trees in certified reforestation projects across the globe.
                        </p>
                        <p className="pt-2">
                            To date, our global community has helped plant over 120 million trees, restoring critical habitats, creating local jobs, and sequestering carbon for generations to come.
                        </p>
                    </section>

                    <section className="grid gap-6 sm:grid-cols-2 pt-6">
                        <div className="border border-line p-6 bg-surface/30">
                            <Leaf className="h-6 w-6 text-forest mb-3" />
                            <h3 className="font-display font-bold uppercase text-base">Circular Materials</h3>
                            <p className="text-sm text-muted pt-1">Hemp, Organic Cotton, Recycled Polyester &amp; TENCEL™ Lyocell.</p>
                        </div>
                        <div className="border border-line p-6 bg-surface/30">
                            <HeartHandshake className="h-6 w-6 text-forest mb-3" />
                            <h3 className="font-display font-bold uppercase text-base">Ethical Fair-Wear</h3>
                            <p className="text-sm text-muted pt-1">Safe working conditions and fair living wages across all manufacturing partners.</p>
                        </div>
                    </section>
                </div>
            </div>
        </StoreLayout>
    );
}
