import Breadcrumbs from '@/Components/store/Breadcrumbs';
import BuyPanel from '@/Components/store/pdp/BuyPanel';
import Gallery from '@/Components/store/pdp/Gallery';
import ProductRail from '@/Components/store/ProductRail';
import SectionHeading from '@/Components/store/SectionHeading';
import Toast from '@/Components/ui/Toast';
import { useCart } from '@/Context/CartContext';
import StoreLayout from '@/Layouts/StoreLayout';
import { Breadcrumb, Product, ProductCard } from '@/types/shop';
import { Head } from '@inertiajs/react';
import { useCallback, useState } from 'react';

interface ProductShowProps {
    product: Product;
    colorways: ProductCard[];
    related: ProductCard[];
    breadcrumbs: Breadcrumb[];
}

function sizeFromQuery(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return new URLSearchParams(window.location.search).get('size');
}

export default function ProductShow({
    product,
    colorways,
    related,
    breadcrumbs,
}: ProductShowProps) {
    const { addItem } = useCart();
    const [toast, setToast] = useState<string | null>(null);
    const closeToast = useCallback(() => setToast(null), []);

    const handleAdd = (size: string) => {
        const selectedSize = product.sizes.find((s) => s.label === size);
        addItem({
            handle: product.handle,
            title: product.title,
            color_name: product.color.name,
            size: size,
            sku: selectedSize?.sku ?? `${product.handle}-${size}`,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            quantity: 1,
            image_src: product.image?.src ?? null,
        });
    };

    return (
        <StoreLayout>
            <Head title={`${product.title} — ${product.color.name}`} />

            <div className="u-container pb-6 pt-6">
                <Breadcrumbs items={breadcrumbs} />
            </div>

            <div className="u-container grid gap-10 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7 xl:col-span-8">
                    <Gallery images={product.images} title={product.title} />
                </div>

                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="lg:sticky lg:top-28">
                        <BuyPanel
                            product={product}
                            colorways={colorways}
                            initialSize={sizeFromQuery()}
                            onAdd={handleAdd}
                        />
                    </div>
                </div>
            </div>

            {related.length > 0 ? (
                <section className="u-container pt-20 lg:pt-28">
                    <SectionHeading
                        title="Complete the look"
                        eyebrow="You might also like"
                    />
                    <ProductRail products={related} />
                </section>
            ) : null}

            <Toast
                open={toast !== null}
                message={toast ?? ''}
                onClose={closeToast}
            />
        </StoreLayout>
    );
}
