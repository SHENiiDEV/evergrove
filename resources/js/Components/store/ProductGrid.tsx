import ProductCard from '@/Components/store/ProductCard';
import { cn } from '@/lib/cn';
import { ProductCard as Card } from '@/types/shop';
import { useMemo } from 'react';

interface ProductGridProps {
    products: Card[];
    className?: string;
    priorityCount?: number;
}

export default function ProductGrid({
    products,
    className,
    priorityCount = 4,
}: ProductGridProps) {
    // Ensure we display 1 unique card per product (groupId)
    const uniqueProducts = useMemo(() => {
        const seen = new Set<number>();
        const list: Card[] = [];

        products.forEach((p) => {
            if (!seen.has(p.groupId)) {
                seen.add(p.groupId);
                list.push(p);
            }
        });

        return list;
    }, [products]);

    // Colourways of the same product become the swatch row on each card.
    const grouped = useMemo(() => {
        const map = new Map<number, Card[]>();

        products.forEach((product) => {
            map.set(product.groupId, [
                ...(map.get(product.groupId) ?? []),
                product,
            ]);
        });

        return map;
    }, [products]);

    return (
        <div
            className={cn(
                'grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:gap-x-4 xl:grid-cols-4',
                className,
            )}
        >
            {uniqueProducts.map((product, index) => {
                const colorways = (product.colorways && product.colorways.length > 0)
                    ? product.colorways
                    : (grouped.get(product.groupId) ?? []);

                return (
                    <ProductCard
                        key={product.id}
                        product={product}
                        colorways={colorways}
                        priority={index < priorityCount}
                    />
                );
            })}
        </div>
    );
}
