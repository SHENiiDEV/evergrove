import ColorSwatches from '@/Components/store/ColorSwatches';
import SizeGuideModal from '@/Components/store/pdp/SizeGuideModal';
import Accordion from '@/Components/ui/Accordion';
import Button from '@/Components/ui/Button';
import { cn } from '@/lib/cn';
import { usePrice } from '@/lib/format';
import { Product, ProductCard } from '@/types/shop';
import { Heart, RotateCcw, Ruler, Truck } from 'lucide-react';
import { useState } from 'react';

interface BuyPanelProps {
    product: Product;
    colorways: ProductCard[];
    initialSize: string | null;
    onAdd: (size: string) => void;
}

export default function BuyPanel({
    product,
    colorways,
    initialSize,
    onAdd,
}: BuyPanelProps) {
    const price = usePrice();
    const [size, setSize] = useState<string | null>(initialSize);
    const [error, setError] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    const submit = () => {
        if (!size) {
            setError(true);

            return;
        }

        onAdd(size);
    };

    return (
        <div className="flex flex-col">
            <p className="u-label text-muted">{product.category.label}</p>
            <h1 className="pt-3 font-display text-3xl font-semibold uppercase lg:text-4xl">
                {product.title}
            </h1>

            <p className="flex items-baseline gap-3 pt-4 text-xl font-semibold tabular-nums">
                {product.compareAtPrice ? (
                    <>
                        <span className="text-sale">
                            {price(product.price)}
                        </span>
                        <span className="text-base font-normal text-muted line-through">
                            {price(product.compareAtPrice)}
                        </span>
                    </>
                ) : (
                    price(product.price)
                )}
            </p>

            {colorways.length > 1 ? (
                <div className="pt-8">
                    <p className="u-label pb-3">
                        Colour:{' '}
                        <span className="font-normal text-muted">
                            {product.color.name}
                        </span>
                    </p>
                    <ColorSwatches
                        colorways={colorways}
                        activeHandle={product.handle}
                        size="md"
                    />
                </div>
            ) : (
                <p className="u-label pt-8">
                    Colour:{' '}
                    <span className="font-normal text-muted">
                        {product.color.name}
                    </span>
                </p>
            )}

            <div className="pt-8">
                <div className="flex items-center justify-between pb-3">
                    <p className="u-label">Size</p>
                    <button
                        type="button"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="u-label flex items-center gap-1.5 text-muted hover:text-ink transition-colors cursor-pointer"
                    >
                        <Ruler className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Size guide
                    </button>
                </div>

                <ul className="grid grid-cols-5 gap-2">
                    {product.sizes.map((option) => (
                        <li key={option.label}>
                            <button
                                type="button"
                                disabled={!option.available}
                                aria-pressed={size === option.label}
                                onClick={() => {
                                    setSize(option.label);
                                    setError(false);
                                }}
                                className={cn(
                                    'u-label h-12 w-full border transition-colors',
                                    !option.available &&
                                        'cursor-not-allowed border-line text-muted/40 line-through',
                                    option.available &&
                                        size === option.label &&
                                        'border-ink bg-ink text-paper',
                                    option.available &&
                                        size !== option.label &&
                                        'border-line hover:border-ink',
                                )}
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>

                {error ? (
                    <p role="alert" className="pt-3 text-sm text-sale">
                        Choose a size first.
                    </p>
                ) : null}
            </div>

            <div className="flex gap-2 pt-8">
                <Button
                    size="lg"
                    fullWidth
                    onClick={submit}
                    disabled={!product.available}
                >
                    {product.available ? 'Add to bag' : 'Sold out'}
                </Button>

                <button
                    type="button"
                    onClick={() => setSaved((value) => !value)}
                    aria-pressed={saved}
                    aria-label="Save to wishlist"
                    className="grid h-14 w-14 shrink-0 place-items-center border border-ink transition-colors hover:bg-surface"
                >
                    <Heart
                        className={cn('h-5 w-5', saved && 'fill-ink')}
                        strokeWidth={1.5}
                    />
                </button>
            </div>

            <ul className="flex flex-col gap-3 pt-7 text-sm text-muted">
                <li className="flex items-center gap-3">
                    <Truck className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    Free delivery over €100, dispatched within 24 hours
                </li>
                <li className="flex items-center gap-3">
                    <RotateCcw className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    Free returns within 30 days
                </li>
            </ul>

            <div className="pt-10">
                <Accordion title="Description" defaultOpen>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: product.descriptionHtml,
                        }}
                    />
                </Accordion>

                <Accordion title="Materials &amp; care">
                    <p>
                        Machine wash cold with like colours, hang to dry. Avoid
                        fabric softener so the technical finish keeps working.
                    </p>
                </Accordion>

                <Accordion title="Delivery &amp; returns">
                    <p>
                        Standard delivery in 2–4 working days, express next day
                        before 14:00. Returns are free for 30 days on unworn
                        items with tags attached.
                    </p>
                </Accordion>
            </div>

            <SizeGuideModal
                open={isSizeGuideOpen}
                onClose={() => setIsSizeGuideOpen(false)}
                defaultGender={product.gender}
            />
        </div>
    );
}
