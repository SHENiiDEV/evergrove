import { Breadcrumb } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
                {items.map((item, index) => (
                    <li key={item.label} className="flex items-center gap-1.5">
                        {index > 0 ? (
                            <ChevronRight className="h-3 w-3" strokeWidth={2} />
                        ) : null}

                        {item.href ? (
                            <Link href={item.href} className="u-link-underline">
                                {item.label}
                            </Link>
                        ) : (
                            <span aria-current="page" className="text-ink">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
