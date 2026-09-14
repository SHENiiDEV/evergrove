import { imageUrl } from '@/lib/image';
import { NavItem } from '@/types/shop';
import { Link } from '@inertiajs/react';

interface MegaMenuProps {
    item: NavItem;
    onNavigate: () => void;
}

export default function MegaMenu({ item, onNavigate }: MegaMenuProps) {
    if (!item.columns) {
        return null;
    }

    return (
        <div className="absolute inset-x-0 top-full hidden animate-slide-down border-t border-line bg-paper text-ink shadow-[0_18px_40px_-24px_rgba(10,10,10,0.35)] lg:block">
            <div className="u-container grid grid-cols-12 gap-10 py-10">
                {item.columns.map((column) => (
                    <div key={column.heading} className="col-span-3">
                        <p className="u-label pb-4 text-muted">
                            {column.heading}
                        </p>
                        <ul className="flex flex-col gap-3">
                            {column.items.map((child) => (
                                <li key={child.label + child.href}>
                                    <Link
                                        href={child.href}
                                        onClick={onNavigate}
                                        className="u-link-underline text-[15px]"
                                    >
                                        {child.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {item.feature ? (
                    <div className="col-span-6 col-start-7">
                        <Link
                            href={item.feature.href}
                            onClick={onNavigate}
                            className="group flex gap-5"
                        >
                            <div className="aspect-[4/5] w-40 shrink-0 overflow-hidden bg-surface">
                                <img
                                    src={imageUrl(item.feature.image, 400)}
                                    alt=""
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                            </div>
                            <div className="flex flex-col justify-end pb-2">
                                <p className="u-label text-muted">
                                    {item.feature.caption}
                                </p>
                                <p className="pt-2 font-display text-2xl font-semibold uppercase">
                                    {item.feature.label}
                                </p>
                                <span className="u-label u-link-underline pt-3">
                                    Shop now
                                </span>
                            </div>
                        </Link>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
