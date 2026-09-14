import { cn } from '@/lib/cn';
import { Facet } from '@/types/shop';
import { Check } from 'lucide-react';

interface FilterOptionsProps {
    group: string;
    facets: Facet[];
    selected: string[];
    onToggle: (value: string) => void;
    layout?: 'list' | 'grid';
}

export default function FilterOptions({
    group,
    facets,
    selected,
    onToggle,
    layout = 'list',
}: FilterOptionsProps) {
    if (facets.length === 0) {
        return (
            <p className="py-2 text-sm text-muted">
                Nothing matches the current filters.
            </p>
        );
    }

    return (
        <ul
            className={cn(
                layout === 'grid'
                    ? 'grid grid-cols-3 gap-2'
                    : 'flex flex-col gap-1',
            )}
        >
            {facets.map((facet) => {
                const checked = selected.includes(facet.value);
                const id = `${group}-${facet.value}`;

                if (layout === 'grid') {
                    return (
                        <li key={facet.value}>
                            <button
                                type="button"
                                id={id}
                                onClick={() => onToggle(facet.value)}
                                aria-pressed={checked}
                                className={cn(
                                    'u-label h-10 w-full border transition-colors',
                                    checked
                                        ? 'border-ink bg-ink text-paper'
                                        : 'border-line hover:border-ink',
                                )}
                            >
                                {facet.label}
                            </button>
                        </li>
                    );
                }

                return (
                    <li key={facet.value}>
                        <label
                            htmlFor={id}
                            className="flex cursor-pointer items-center gap-3 py-1.5 text-[15px]"
                        >
                            <input
                                id={id}
                                type="checkbox"
                                checked={checked}
                                onChange={() => onToggle(facet.value)}
                                className="sr-only"
                            />

                            <span
                                className={cn(
                                    'grid h-5 w-5 shrink-0 place-items-center border transition-colors',
                                    checked
                                        ? 'border-ink bg-ink text-paper'
                                        : 'border-line',
                                )}
                            >
                                {checked ? (
                                    <Check
                                        className="h-3.5 w-3.5"
                                        strokeWidth={3}
                                    />
                                ) : null}
                            </span>

                            {facet.hex ? (
                                <span
                                    className="h-4 w-4 shrink-0 rounded-full ring-1 ring-inset ring-ink/10"
                                    style={{ backgroundColor: facet.hex }}
                                />
                            ) : null}

                            <span className="flex-1">{facet.label}</span>
                            <span className="text-sm text-muted">
                                {facet.count}
                            </span>
                        </label>
                    </li>
                );
            })}
        </ul>
    );
}
