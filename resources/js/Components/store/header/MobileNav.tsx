import Drawer from '@/Components/ui/Drawer';
import { NavItem } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface MobileNavProps {
    open: boolean;
    onClose: () => void;
    items: NavItem[];
}

export default function MobileNav({ open, onClose, items }: MobileNavProps) {
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <Drawer open={open} onClose={onClose} title="Menu" side="left">
            <nav className="flex flex-col">
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
        </Drawer>
    );
}
