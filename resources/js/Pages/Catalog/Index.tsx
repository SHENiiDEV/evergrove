import Breadcrumbs from '@/Components/store/Breadcrumbs';
import ActiveFilters from '@/Components/store/catalog/ActiveFilters';
import FilterBar from '@/Components/store/catalog/FilterBar';
import Pagination from '@/Components/store/catalog/Pagination';
import ProductGrid from '@/Components/store/ProductGrid';
import Button from '@/Components/ui/Button';
import { useCatalogFilters } from '@/hooks/useCatalogFilters';
import StoreLayout from '@/Layouts/StoreLayout';
import {
    Breadcrumb,
    CatalogFacets,
    CatalogFilters,
    ProductCard,
    SortKey,
    SortOption,
} from '@/types/shop';
import { Head } from '@inertiajs/react';

interface CatalogProps {
    heading: string;
    query: string | null;
    breadcrumbs: Breadcrumb[];
    lockedCategory: string | null;
    filters: CatalogFilters;
    facets: CatalogFacets;
    sort: SortKey;
    sortOptions: SortOption[];
    products: ProductCard[];
    total: number;
    page: number;
    pages: number;
}

export default function CatalogIndex({
    heading,
    query,
    breadcrumbs,
    lockedCategory,
    filters,
    facets,
    sort,
    sortOptions,
    products,
    total,
    page,
    pages,
}: CatalogProps) {
    const controls = useCatalogFilters({ filters, sort, query });

    return (
        <StoreLayout>
            <Head title={heading} />

            <div className="u-container pb-6 pt-8">
                <Breadcrumbs items={breadcrumbs} />

                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-5">
                    <h1 className="text-display-sm font-semibold uppercase">
                        {heading}
                    </h1>
                    <p className="text-sm text-muted">
                        {total} {total === 1 ? 'product' : 'products'}
                    </p>
                </div>
            </div>

            <FilterBar
                facets={facets}
                filters={filters}
                sort={sort}
                sortOptions={sortOptions}
                total={total}
                lockedCategory={lockedCategory}
                controls={controls}
            />

            <div className="u-container pb-8 pt-2">
                <ActiveFilters
                    filters={filters}
                    facets={facets}
                    lockedCategory={lockedCategory}
                    controls={controls}
                />
            </div>

            <div className="u-container">
                {products.length > 0 ? (
                    <>
                        <ProductGrid products={products} />
                        <Pagination
                            page={page}
                            pages={pages}
                            onChange={controls.goToPage}
                        />
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-5 py-24 text-center">
                        <h2 className="text-display-sm font-semibold uppercase">
                            Nothing here yet
                        </h2>
                        <p className="max-w-sm text-[15px] text-muted">
                            No products match this combination. Try removing a
                            filter or two.
                        </p>
                        <Button onClick={() => controls.clearAll()}>
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
