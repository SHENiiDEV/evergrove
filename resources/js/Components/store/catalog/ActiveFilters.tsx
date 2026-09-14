import { useCatalogFilters } from '@/hooks/useCatalogFilters';
import { CatalogFacets, CatalogFilters } from '@/types/shop';
import { X } from 'lucide-react';

type Group = keyof CatalogFilters;

interface ActiveFiltersProps {
    filters: CatalogFilters;
    facets: CatalogFacets;
    /** A category that comes from the URL path cannot be removed as a chip. */
    lockedCategory: string | null;
    controls: ReturnType<typeof useCatalogFilters>;
}

export default function ActiveFilters({
    filters,
    facets,
    controls,
}: ActiveFiltersProps) {
    const chips = (Object.keys(filters) as Group[]).flatMap((group) =>
        filters[group].map((value) => ({
            group,
            value,
            label:
                facets[group].find((facet) => facet.value === value)?.label ??
                value,
        })),
    );

    if (chips.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2 pt-5">
            {chips.map((chip) => (
                <button
                    key={`${chip.group}-${chip.value}`}
                    type="button"
                    onClick={() => controls.toggle(chip.group, chip.value)}
                    className="flex h-8 items-center gap-2 border border-line px-3 text-sm transition-colors hover:border-ink"
                >
                    {chip.label}
                    <X className="h-3.5 w-3.5" strokeWidth={2} />
                    <span className="sr-only">Remove filter</span>
                </button>
            ))}

            <button
                type="button"
                onClick={() => controls.clearAll()}
                className="u-label px-2 text-muted underline underline-offset-4 transition-colors hover:text-ink"
            >
                Clear all
            </button>
        </div>
    );
}
