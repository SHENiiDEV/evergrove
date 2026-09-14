import { cn } from '@/lib/cn';
import { ProductBadge } from '@/types/shop';

const LABELS: Record<ProductBadge, string> = {
    new: 'New',
    sale: 'Sale',
    'sold-out': 'Sold out',
    'low-stock': 'Low stock',
};

const STYLES: Record<ProductBadge, string> = {
    new: 'bg-ink text-paper',
    sale: 'bg-sale text-paper',
    'sold-out': 'bg-paper/90 text-ink ring-1 ring-inset ring-line',
    'low-stock': 'bg-accent text-ink',
};

export default function Badge({
    badge,
    className,
}: {
    badge: ProductBadge;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'u-label inline-flex h-6 items-center px-2',
                STYLES[badge],
                className,
            )}
        >
            {LABELS[badge]}
        </span>
    );
}
