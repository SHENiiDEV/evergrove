import { cn } from '@/lib/cn';
import { ProductCard } from '@/types/shop';
import { Link } from '@inertiajs/react';

interface ColorSwatchesProps {
    colorways: ProductCard[];
    activeHandle: string;
    size?: 'sm' | 'md';
    className?: string;
}

export default function ColorSwatches({
    colorways,
    activeHandle,
    size = 'sm',
    className,
}: ColorSwatchesProps) {
    if (colorways.length < 2) {
        return null;
    }

    const dot = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';

    return (
        <ul className={cn('flex flex-wrap items-center gap-1.5', className)}>
            {colorways.map((colorway) => {
                const active = colorway.handle === activeHandle;

                return (
                    <li key={colorway.id}>
                        <Link
                            href={colorway.url}
                            title={colorway.color.name}
                            aria-label={colorway.color.name}
                            aria-current={active ? 'true' : undefined}
                            className={cn(
                                'grid place-items-center rounded-full border transition-colors',
                                size === 'sm' ? 'h-6 w-6' : 'h-8 w-8',
                                active
                                    ? 'border-ink'
                                    : 'border-transparent hover:border-line',
                            )}
                        >
                            <span
                                className={cn(
                                    'rounded-full ring-1 ring-inset ring-ink/10',
                                    dot,
                                )}
                                style={{ backgroundColor: colorway.color.hex }}
                            />
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
