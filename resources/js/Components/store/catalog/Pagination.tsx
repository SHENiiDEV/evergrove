import { cn } from '@/lib/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    page: number;
    pages: number;
    onChange: (page: number) => void;
}

export default function Pagination({ page, pages, onChange }: PaginationProps) {
    if (pages < 2) {
        return null;
    }

    const button =
        'grid h-10 w-10 place-items-center border transition-colors disabled:opacity-30';

    return (
        <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-1 pt-14"
        >
            <button
                type="button"
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
                className={cn(
                    button,
                    'border-line hover:border-ink disabled:hover:border-line',
                )}
            >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>

            {Array.from({ length: pages }, (_, index) => index + 1).map(
                (entry) => (
                    <button
                        key={entry}
                        type="button"
                        onClick={() => onChange(entry)}
                        aria-current={entry === page ? 'page' : undefined}
                        className={cn(
                            button,
                            'u-label',
                            entry === page
                                ? 'border-ink bg-ink text-paper'
                                : 'border-line hover:border-ink',
                        )}
                    >
                        {entry}
                    </button>
                ),
            )}

            <button
                type="button"
                onClick={() => onChange(page + 1)}
                disabled={page === pages}
                aria-label="Next page"
                className={cn(
                    button,
                    'border-line hover:border-ink disabled:hover:border-line',
                )}
            >
                <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
        </nav>
    );
}
