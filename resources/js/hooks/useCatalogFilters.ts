import { CatalogFilters, SortKey } from '@/types/shop';
import { router } from '@inertiajs/react';

type FilterGroup = keyof CatalogFilters;

const RELOAD_ONLY = [
    'products',
    'facets',
    'total',
    'page',
    'pages',
    'filters',
    'sort',
];

interface CatalogState {
    filters: CatalogFilters;
    sort: SortKey;
    query: string | null;
}

/**
 * Filter state lives in the URL, so the grid survives a refresh, a shared link
 * and the browser's back button. Only the grid props are re-fetched.
 */
export function useCatalogFilters({ filters, sort, query }: CatalogState) {
    const visit = (
        nextFilters: CatalogFilters,
        nextSort: SortKey,
        page?: number,
    ) => {
        const params: Record<string, string | string[] | number> = {};

        (Object.keys(nextFilters) as FilterGroup[]).forEach((group) => {
            if (nextFilters[group].length > 0) {
                params[group] = nextFilters[group];
            }
        });

        if (nextSort !== 'featured') {
            params.sort = nextSort;
        }

        if (query) {
            params.q = query;
        }

        if (page && page > 1) {
            params.page = page;
        }

        router.get(window.location.pathname, params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: RELOAD_ONLY,
        });
    };

    return {
        toggle(group: FilterGroup, value: string) {
            const current = filters[group];
            const next = current.includes(value)
                ? current.filter((entry) => entry !== value)
                : [...current, value];

            visit({ ...filters, [group]: next }, sort);
        },

        clearGroup(group: FilterGroup) {
            visit({ ...filters, [group]: [] }, sort);
        },

        clearAll() {
            visit({ category: [], size: [], color: [], price: [] }, sort);
        },

        setSort(nextSort: SortKey) {
            visit(filters, nextSort);
        },

        goToPage(page: number) {
            visit(filters, sort, page);
        },
    };
}
