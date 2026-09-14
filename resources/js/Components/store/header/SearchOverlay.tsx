import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';

const SUGGESTIONS = [
    'Rain jacket',
    'Puffer vest',
    'Zip hoodie',
    'Fleece',
    'Parka',
];

interface SearchOverlayProps {
    open: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
    const input = useRef<HTMLInputElement>(null);
    const [term, setTerm] = useState('');

    useBodyScrollLock(open);

    useEffect(() => {
        if (!open) {
            return;
        }

        input.current?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    const submit = (event: FormEvent) => {
        event.preventDefault();
        onClose();
        router.get(route('catalog'), { q: term }, { preserveScroll: false });
    };

    const search = (value: string) => {
        onClose();
        router.get(route('catalog'), { q: value });
    };

    return (
        <div className="fixed inset-0 z-50 animate-fade-in bg-paper">
            <div className="u-container flex h-16 items-center gap-4 border-b border-line lg:h-[68px]">
                <Search
                    className="h-5 w-5 shrink-0 text-muted"
                    strokeWidth={1.5}
                />

                <form onSubmit={submit} className="flex-1" role="search">
                    <label htmlFor="site-search" className="sr-only">
                        Search products
                    </label>
                    <input
                        id="site-search"
                        ref={input}
                        value={term}
                        onChange={(event) => setTerm(event.target.value)}
                        type="search"
                        placeholder="What are you looking for?"
                        className="w-full border-0 bg-transparent p-0 text-lg placeholder:text-muted focus:ring-0"
                    />
                </form>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close search"
                    className="-mr-2 grid h-10 w-10 shrink-0 place-items-center transition-colors hover:bg-surface"
                >
                    <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
            </div>

            <div className="u-container py-8">
                <p className="u-label pb-4 text-muted">Popular searches</p>
                <ul className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((suggestion) => (
                        <li key={suggestion}>
                            <button
                                type="button"
                                onClick={() => search(suggestion)}
                                className="border border-line px-4 py-2 text-sm transition-colors hover:border-ink"
                            >
                                {suggestion}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
