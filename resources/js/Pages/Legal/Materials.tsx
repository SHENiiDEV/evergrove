import StoreLayout from '@/Layouts/StoreLayout';
import { Head } from '@inertiajs/react';
import { Feather, Flame, Recycle, Sparkles, Wind } from 'lucide-react';

export default function Materials() {
    return (
        <StoreLayout>
            <Head title="Sustainable Materials - EverGrove" />
            <div className="u-container max-w-4xl py-12 lg:py-20">
                <p className="u-label text-forest">Sourcing &amp; Fiber Innovation</p>
                <h1 className="pt-2 font-display text-3xl font-bold uppercase tracking-tight lg:text-5xl text-ink">
                    Materials Made with Purpose
                </h1>
                <p className="pt-3 text-base text-muted max-w-2xl leading-relaxed">
                    We select our fibers based on regenerative agriculture, water conservation, circular recyclability, and supreme everyday comfort.
                </p>

                <div className="grid gap-8 pt-12">
                    {[
                        {
                            title: 'Hemp',
                            subtitle: 'Nature’s most durable & carbon-negative fiber',
                            desc: 'Hemp requires 50% less water than traditional cotton, absorbs more CO2 per hectare than trees, and naturally resists odors and bacteria.',
                            icon: Sparkles,
                        },
                        {
                            title: 'Organic Cotton (GOTS Certified)',
                            subtitle: 'Pesticide-free softness',
                            desc: 'Grown without synthetic chemicals or GMO seeds, preserving soil fertility and protecting farming communities and groundwater.',
                            icon: Feather,
                        },
                        {
                            title: 'Recycled Polyester (REPREVE®)',
                            subtitle: 'Diverting plastics from ocean landfills',
                            desc: 'Spun from post-consumer plastic bottles, giving discarded waste a second life while providing water-repellent durability.',
                            icon: Recycle,
                        },
                        {
                            title: 'TENCEL™ Lyocell',
                            subtitle: 'Closed-loop eucalyptus botanic fiber',
                            desc: 'Manufactured through an environmentally responsible closed-loop process that recycles 99.5% of water and solvents used.',
                            icon: Wind,
                        },
                    ].map((item) => (
                        <div key={item.title} className="border border-line p-8 bg-surface/30 space-y-2">
                            <div className="flex items-center gap-3">
                                <item.icon className="h-6 w-6 text-forest" strokeWidth={1.5} />
                                <h2 className="font-display text-2xl font-bold uppercase text-ink">{item.title}</h2>
                            </div>
                            <p className="text-xs uppercase tracking-wider font-semibold text-forest">{item.subtitle}</p>
                            <p className="text-sm text-ink/80 pt-2 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </StoreLayout>
    );
}
