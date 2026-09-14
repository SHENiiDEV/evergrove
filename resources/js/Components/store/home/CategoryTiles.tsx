import ProductImage from '@/Components/store/ProductImage';
import { cn } from '@/lib/cn';
import { Gender, ShopImage } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export interface CategoryTile {
    label: string;
    href: string;
    image: ShopImage;
}

const TABS: { value: Gender; label: string }[] = [
    { value: 'women', label: 'Women' },
    { value: 'men', label: 'Men' },
];

export default function CategoryTiles({
    tiles,
}: {
    tiles: Record<Gender, CategoryTile[]>;
}) {
    const [gender, setGender] = useState<Gender>('women');

    return (
        <section className="u-container pt-16 lg:pt-24">
            <div className="flex flex-wrap items-end justify-between gap-4 pb-5">
                <h2 className="text-display-sm font-semibold uppercase">
                    Shop by category
                </h2>

                <div
                    role="tablist"
                    aria-label="Shop by gender"
                    className="flex gap-1"
                >
                    {TABS.map((tab) => (
                        <button
                            key={tab.value}
                            role="tab"
                            type="button"
                            aria-selected={gender === tab.value}
                            onClick={() => setGender(tab.value)}
                            className={cn(
                                'u-label h-9 border px-5 transition-colors',
                                gender === tab.value
                                    ? 'border-ink bg-ink text-paper'
                                    : 'border-line text-muted hover:border-ink hover:text-ink',
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                {tiles[gender].map((tile) => (
                    <li key={tile.href}>
                        <Link href={tile.href} className="group block">
                            <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                                <ProductImage
                                    image={tile.image}
                                    sizes="(min-width: 1024px) 24vw, 48vw"
                                    alt=""
                                    className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 pt-12">
                                    <span className="u-label text-paper">
                                        {tile.label}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
