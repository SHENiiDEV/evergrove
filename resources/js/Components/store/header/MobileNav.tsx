import Drawer from '@/Components/ui/Drawer';
import { PageProps } from '@/types';
import { NavItem } from '@/types/shop';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useState } from 'react';

interface MobileNavProps {
    open: boolean;
    onClose: () => void;
    items: NavItem[];
}

export default function MobileNav({ open, onClose, items }: MobileNavProps) {
    const { auth } = usePage<PageProps>().props;
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <Drawer open={open} onClose={onClose} title="Menu" side="left">
            <div className="flex flex-col min-h-full">
                <nav className="flex flex-col flex-1">
                    {items.map((item) => {
                        const isOpen = expanded === item.label;

                        if (!item.columns) {
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={onClose}
                                    className="border-b border-line px-5 py-4 font-display text-xl font-semibold uppercase"
                                >
                                    {item.label}
                                </Link>
                            );
                        }

                        return (
                            <div key={item.label} className="border-b border-line">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpanded(isOpen ? null : item.label)
                                    }
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center justify-between px-5 py-4 text-left font-display text-xl font-semibold uppercase"
                                >
                                    {item.label}
                                    <ChevronDown
                                        className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                        strokeWidth={1.5}
                                    />
                                </button>

                                {isOpen ? (
                                    <div className="animate-slide-down bg-surface px-5 pb-5 pt-1">
                                        {item.columns.map((column) => (
                                            <div
                                                key={column.heading}
                                                className="pt-4 first:pt-0"
                                            >
                                                <p className="u-label pb-3 text-muted">
                                                    {column.heading}
                                                </p>
                                                <ul className="flex flex-col gap-3">
                                                    {column.items.map((child) => (
                                                        <li
                                                            key={
                                                                child.label +
                                                                child.href
                                                            }
                                                        >
                                                            <Link
                                                                href={child.href}
                                                                onClick={onClose}
                                                                className="text-[15px]"
                                                            >
                                                                {child.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </nav>

                {/* Customer Account on Mobile */}
                <div className="border-t border-line bg-surface/50 p-5 mt-auto">
                    {auth?.user ? (
                        <div className="space-y-3">
                            <div className="text-xs text-muted">
                                Signed in as{' '}
                                <span className="font-semibold text-ink">
                                    {auth.user.name}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Link
                                    href={route('dashboard')}
                                    onClick={onClose}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:underline"
                                >
                                    <User className="h-4 w-4" />
                                    My Orders & Account
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        router.post(route('logout'));
                                    }}
                                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-sale text-left pt-1"
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('login')}
                                onClick={onClose}
                                className="flex-1 text-center py-2.5 rounded bg-ink text-paper text-xs font-semibold uppercase tracking-wider hover:bg-ink/85 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href={route('register')}
                                onClick={onClose}
                                className="flex-1 text-center py-2.5 rounded border border-ink text-ink text-xs font-semibold uppercase tracking-wider hover:bg-surface transition-colors"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Drawer>
    );
}

