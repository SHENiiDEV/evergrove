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
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    colorways={grouped.get(product.groupId) ?? []}
                    priority={index < priorityCount}
                />
            ))}
        </div>
    );
}
