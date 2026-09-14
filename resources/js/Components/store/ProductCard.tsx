import ColorSwatches from '@/Components/store/ColorSwatches';
import ProductImage from '@/Components/store/ProductImage';
import Badge from '@/Components/ui/Badge';
import { cn } from '@/lib/cn';
import { usePrice } from '@/lib/format';
import { ProductCard as Card } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
    product: Card;
    colorways?: Card[];
    sizes?: string;
    priority?: boolean;
    className?: string;
}

export default function ProductCard({
    product,
    colorways = [],
    sizes = '(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw',
    priority = false,
    className,
}: ProductCardProps) {
    const price = usePrice();
    const [saved, setSaved] = useState(false);

    const allColorways = colorways.length > 0 ? colorways : (product.colorways ?? []);
    const soldOut = !product.available;
    const badges = product.badges.filter((badge) => badge !== 'sold-out');

    return (
        <article className={cn('group relative flex flex-col', className)}>
            <div className="relative z-10 overflow-hidden bg-surface">
                <Link
                    href={product.url}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block"
                >
                    <div className="relative aspect-[4/5]">
                        <ProductImage
                            image={product.image}
                            sizes={sizes}
                            priority={priority}
                            className={cn(
                                'transition-opacity duration-500 ease-out',
                                product.hoverImage && 'group-hover:opacity-0',
                                soldOut && 'opacity-60',
                            )}
                        />

                        {product.hoverImage ? (
                            <ProductImage
                                image={product.hoverImage}
                                sizes={sizes}
                                className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                            />
                        ) : null}
                    </div>
                </Link>

                {badges.length > 0 || soldOut ? (
                    <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1">
                        {soldOut ? <Badge badge="sold-out" /> : null}
                        {badges.map((badge) => (
                            <Badge key={badge} badge={badge} />
                        ))}
                    </div>
                ) : null}

                <button
                    type="button"
                    onClick={() => setSaved((value) => !value)}
                    aria-pressed={saved}
                    aria-label={
                        saved
                            ? `Remove ${product.title} from wishlist`
                            : `Save ${product.title} to wishlist`
                    }
                    className="absolute right-2 top-2 grid h-9 w-9 place-items-center text-ink transition-transform duration-200 ease-out hover:scale-110"
                >
                    <Heart
                        className={cn('h-5 w-5', saved && 'fill-ink')}
                        strokeWidth={1.5}
                    />
                </button>

                {/* Desktop quick size picker — jumps straight to the size on the product page. */}
                {!soldOut ? (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full bg-paper/95 p-2 opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 lg:block">
                        <ul className="flex flex-wrap justify-center gap-1">
                            {product.sizes.map((size) => (
                                <li key={size.label}>
                                    <Link
                                        href={`${product.url}?size=${size.label}`}
                                        aria-disabled={!size.available}
                                        tabIndex={
                                            size.available ? undefined : -1
                                        }
                                        className={cn(
                                            'u-label grid h-8 min-w-[2.25rem] place-items-center px-1.5 transition-colors',
                                            size.available
                                                ? 'text-ink hover:bg-ink hover:text-paper'
                                                : 'pointer-events-none text-muted/50 line-through',
                                        )}
                                    >
                                        {size.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-1 pt-3">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-sans text-[15px] font-medium leading-snug">
                        <Link
                            href={product.url}
                            className="after:absolute after:inset-0 after:content-['']"
                        >
                            {product.title}
                        </Link>
                    </h3>

                    <p className="shrink-0 text-right text-[15px] font-semibold tabular-nums">
                        {product.compareAtPrice ? (
                            <>
                                <span className="text-sale">
                                    {price(product.price)}
                                </span>
                                <span className="ml-2 text-[13px] font-normal text-muted line-through">
                                    {price(product.compareAtPrice)}
                                </span>
                            </>
                        ) : (
                            price(product.price)
                        )}
                    </p>
                </div>

                <p className="text-[13px] text-muted">{product.color.name}</p>

                {allColorways.length > 1 ? (
                    <ColorSwatches
                        colorways={allColorways}
                        activeHandle={product.handle}
                        className="relative z-10 mt-1"
                    />
                ) : null}
            </div>
        </article>
    );
}
