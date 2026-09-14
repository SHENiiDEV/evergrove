import FilterOptions from '@/Components/store/catalog/FilterOptions';
import Button from '@/Components/ui/Button';
import Drawer from '@/Components/ui/Drawer';
import { useCatalogFilters } from '@/hooks/useCatalogFilters';
import { cn } from '@/lib/cn';
import {
    CatalogFacets,
    CatalogFilters,
    SortKey,
    SortOption,
} from '@/types/shop';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Group = keyof CatalogFilters;

const GROUPS: { key: Group; label: string; layout: 'list' | 'grid' }[] = [
    { key: 'category', label: 'Category', layout: 'list' },
    { key: 'size', label: 'Size', layout: 'grid' },
    { key: 'color', label: 'Colour', layout: 'list' },
    { key: 'price', label: 'Price', layout: 'list' },
];

interface FilterBarProps {
    facets: CatalogFacets;
    filters: CatalogFilters;
    sort: SortKey;
    sortOptions: SortOption[];
    total: number;
    lockedCategory: string | null;
    controls: ReturnType<typeof useCatalogFilters>;
}

export default function FilterBar({
    facets,
    filters,
    sort,
    sortOptions,
    total,
    lockedCategory,
    controls,
}: FilterBarProps) {
    const [openGroup, setOpenGroup] = useState<Group | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const bar = useRef<HTMLDivElement>(null);

    const groups = GROUPS.filter(
        (group) => group.key !== 'category' || !lockedCategory,
    );

    useEffect(() => {
        const onPointerDown = (event: MouseEvent) => {
            if (bar.current && !bar.current.contains(event.target as Node)) {
                setOpenGroup(null);
            }
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpenGroup(null);
            }
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    const sortSelect = (
        <div className="relative">
            <label htmlFor="catalog-sort" className="sr-only">
                Sort products
            </label>
            <select
                id="catalog-sort"
                value={sort}
                onChange={(event) =>
                    controls.setSort(event.target.value as SortKey)
                }
                className="u-label h-10 w-full appearance-none border border-line bg-paper py-0 pl-4 pr-10 transition-colors hover:border-ink focus:border-ink focus:ring-0"
            >
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
                strokeWidth={1.5}
            />
        </div>
    );

    return (
        <div
            ref={bar}
            className="sticky top-14 z-30 border-y border-line bg-paper/95 backdrop-blur lg:top-[68px]"
        >
            <div className="u-container flex h-14 items-center justify-between gap-4">
                {/* Mobile */}
                <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="u-label flex items-center gap-2 lg:hidden"
                >
                    <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
                    Filter &amp; sort
                </button>

                {/* Desktop */}
                <ul className="hidden items-center gap-1 lg:flex">
                    {groups.map((group) => {
                        const count = filters[group.key].length;
                        const open = openGroup === group.key;

                        return (
                            <li key={group.key} className="relative">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenGroup(open ? null : group.key)
                                    }
                                    aria-expanded={open}
                                    className={cn(
                                        'u-label flex h-10 items-center gap-2 border px-4 transition-colors',
                                        open || count > 0
                                            ? 'border-ink'
                                            : 'border-transparent hover:border-line',
                                    )}
                                >
                                    {group.label}
                                    {count > 0 ? (
                                        <span className="grid h-4 min-w-[1rem] place-items-center bg-ink px-1 text-[10px] text-paper">
                                            {count}
                                        </span>
                                    ) : null}
                                    <ChevronDown
                                        className={cn(
                                            'h-3.5 w-3.5 transition-transform',
                                            open && 'rotate-180',
                                        )}
                                        strokeWidth={2}
                                    />
                                </button>

                                {open ? (
                                    <div className="absolute left-0 top-full z-10 mt-px w-72 animate-slide-down border border-line bg-paper p-5 shadow-[0_18px_40px_-24px_rgba(10,10,10,0.35)]">
                                        <FilterOptions
                                            group={group.key}
                                            facets={facets[group.key]}
                                            selected={filters[group.key]}
                                            onToggle={(value) =>
                                                controls.toggle(
                                                    group.key,
                                                    value,
                                                )
                                            }
                                            layout={group.layout}
                                        />

                                        {filters[group.key].length > 0 ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    controls.clearGroup(
                                                        group.key,
                                                    )
                                                }
                                                className="u-label pt-4 text-muted underline underline-offset-4"
                                            >
                                                Clear
                                            </button>
                                        ) : null}
                                    </div>
                                ) : null}
                            </li>
                        );
                    })}
                </ul>

                <div className="flex items-center gap-5">
                    <p className="hidden text-sm text-muted sm:block">
                        {total} {total === 1 ? 'product' : 'products'}
                    </p>
                    <div className="hidden lg:block">{sortSelect}</div>
                </div>
            </div>

            <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Filter & sort"
                side="bottom"
                footer={
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => controls.clearAll()}
                        >
                            Clear all
                        </Button>
                        <Button fullWidth onClick={() => setDrawerOpen(false)}>
                            Show {total}
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-6 p-5">
                    <div>
                        <p className="u-label pb-3 text-muted">Sort by</p>
                        {sortSelect}
                    </div>

                    {groups.map((group) => (
                        <div key={group.key}>
                            <p className="u-label pb-3 text-muted">
                                {group.label}
                            </p>
                            <FilterOptions
                                group={`m-${group.key}`}
                                facets={facets[group.key]}
                                selected={filters[group.key]}
                                onToggle={(value) =>
                                    controls.toggle(group.key, value)
                                }
                                layout={group.layout}
                            />
                        </div>
                    ))}
                </div>
            </Drawer>
        </div>
    );
}
