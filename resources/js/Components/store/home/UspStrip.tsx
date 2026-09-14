import { RotateCcw, Sprout, Trees } from 'lucide-react';

const ITEMS = [
    {
        icon: Trees,
        title: '10 Trees Planted Per Item',
        copy: 'Over 120+ million trees planted worldwide with our community.',
    },
    {
        icon: Sprout,
        title: 'Earth-First Materials',
        copy: 'Ethically crafted with organic cotton, hemp, recycled polyester and Tencel.',
    },
    {
        icon: RotateCcw,
        title: '30-Day Free Returns',
        copy: 'Hassle-free exchanges and returns on unworn items.',
    },
];

export default function UspStrip() {
    return (
        <section className="u-container pt-16 lg:pt-24">
            <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
                {ITEMS.map((item) => (
                    <li
                        key={item.title}
                        className="flex items-start gap-4 bg-paper p-6"
                    >
                        <item.icon
                            className="mt-0.5 h-5 w-5 shrink-0"
                            strokeWidth={1.5}
                        />
                        <div>
                            <p className="u-label">{item.title}</p>
                            <p className="pt-2 text-sm leading-relaxed text-muted">
                                {item.copy}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
