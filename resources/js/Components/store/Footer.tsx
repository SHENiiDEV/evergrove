import Button from '@/Components/ui/Button';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';

const LEGAL_LINKS = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Shipping & Delivery', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Legal Notice', href: '/legal' },
];

export default function Footer() {
    const { footerColumns, shop, company } = usePage<PageProps>().props;
    const [expanded, setExpanded] = useState<string | null>(null);
    const [subscribed, setSubscribed] = useState(false);

    const subscribe = (event: FormEvent) => {
        event.preventDefault();
        setSubscribed(true);
    };

    return (
        <footer className="mt-20 border-t border-line lg:mt-28">
            {/* Newsletter Strip */}
            <div className="bg-ink text-paper">
                <div className="u-container grid gap-8 py-14 lg:grid-cols-2 lg:items-center lg:py-16">
                    <div>
                        <h2 className="text-display-sm font-semibold uppercase">
                            Ten percent off your first order
                        </h2>
                        <p className="max-w-md pt-3 text-[15px] text-paper/70">
                            New arrivals, restocks and reforestation stories. No noise, unsubscribe whenever. Use code <strong className="text-paper underline">EVER10</strong> at checkout.
                        </p>
                    </div>

                    <form
                        onSubmit={subscribe}
                        className="flex w-full max-w-md gap-2 lg:justify-self-end"
                    >
                        <label htmlFor="newsletter-email" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="newsletter-email"
                            type="email"
                            required
                            placeholder="Email address"
                            className="h-11 flex-1 border-0 border-b border-paper/30 bg-transparent px-0 text-[15px] text-paper placeholder:text-paper/50 focus:border-paper focus:ring-0"
                        />
                        <Button type="submit" variant="inverse">
                            {subscribed ? 'Signed up' : 'Sign up'}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="u-container grid gap-8 py-12 lg:grid-cols-4 lg:gap-10 lg:py-16">
                <div className="space-y-4">
                    <p className="font-display text-2xl font-bold uppercase leading-none">
                        {shop.name}
                    </p>
                    <p className="max-w-[28ch] text-sm leading-relaxed text-muted">
                        Sustainable apparel & accessories made with hemp, organic cotton, recycled polyester and TENCEL™. Every item plants 10 trees.
                    </p>

                    {/* Company Legal Micro-Block */}
                    {company && (
                        <div className="pt-2 text-xs text-muted/80 space-y-1.5 border-t border-line/60">
                            <p className="font-semibold text-ink/90 flex items-center gap-1.5">
                                <ShieldCheck className="h-3.5 w-3.5 text-forest" />
                                {company.name}
                            </p>
                            {company.number && (
                                <p>Company No: <span className="text-ink/80 font-mono">{company.number}</span></p>
                            )}
                            {company.address && (
                                <p className="flex items-start gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted" />
                                    <span>{company.address}</span>
                                </p>
                            )}
                            {company.email && (
                                <p className="flex items-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5 shrink-0 text-muted" />
                                    <a href={`mailto:${company.email}`} className="text-ink hover:underline">
                                        {company.email}
                                    </a>
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {footerColumns.map((column) => {
                    const open = expanded === column.heading;

                    return (
                        <div
                            key={column.heading}
                            className="border-b border-line lg:border-0"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setExpanded(open ? null : column.heading)
                                }
                                aria-expanded={open}
                                className="flex w-full items-center justify-between py-4 lg:pointer-events-none lg:py-0"
                            >
                                <span className="u-label">
                                    {column.heading}
                                </span>
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform lg:hidden ${open ? 'rotate-180' : ''}`}
                                    strokeWidth={1.5}
                                    />
                            </button>

                            <ul
                                className={`flex-col gap-3 pb-5 pt-1 lg:flex lg:pb-0 lg:pt-5 ${open ? 'flex' : 'hidden'}`}
                            >
                                {column.items.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="u-link-underline text-sm text-muted hover:text-ink transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Copyright & Legal Links Bar */}
            <div className="border-t border-line bg-surface/30">
                <div className="u-container flex flex-col gap-4 py-6 text-[13px] text-muted md:flex-row md:items-center md:justify-between">
                    <p>
                        © {new Date().getFullYear()} {company?.name || shop.name}. All rights reserved.
                    </p>

                    <ul className="flex flex-wrap gap-x-6 gap-y-2">
                        {LEGAL_LINKS.map((item) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className="u-link-underline hover:text-ink transition-colors"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}
