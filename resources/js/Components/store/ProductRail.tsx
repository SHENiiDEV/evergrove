import ProductCard from '@/Components/store/ProductCard';
import { ProductCard as Card } from '@/types/shop';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ProductRail({ products }: { products: Card[] }) {
    const track = useRef<HTMLUListElement>(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const sync = useCallback(() => {
        const node = track.current;

        if (!node) {
            return;
        }

        setAtStart(node.scrollLeft <= 8);
        setAtEnd(node.scrollLeft + node.clientWidth >= node.scrollWidth - 8);
    }, []);

    useEffect(() => {
        sync();
        window.addEventListener('resize', sync);

        return () => window.removeEventListener('resize', sync);
    }, [sync]);

    const scrollBy = (direction: 1 | -1) => {
        const node = track.current;

        if (node) {
            node.scrollBy({
                left: direction * node.clientWidth * 0.8,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="relative">
            <ul
                ref={track}
                onScroll={sync}
                className="u-no-scrollbar u-snap-x -mx-4 flex gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:gap-4 lg:px-10"
            >
                {products.map((product, index) => (
                    <li
                        key={product.id}
                        className="u-snap-start w-[62%] shrink-0 sm:w-[38%] lg:w-[23%] xl:w-[19%]"
                    >
                        <ProductCard
                            product={product}
                            priority={index < 3}
                            sizes="(min-width: 1280px) 19vw, (min-width: 1024px) 23vw, (min-width: 640px) 38vw, 62vw"
                        />
                    </li>
                ))}
            </ul>

            <div className="pointer-events-none absolute -top-14 right-0 hidden gap-1 lg:flex">
                <button
                    type="button"
                    onClick={() => scrollBy(-1)}
                    disabled={atStart}
                    aria-label="Previous products"
                    className="pointer-events-auto grid h-10 w-10 place-items-center border border-line transition-colors hover:border-ink disabled:opacity-30 disabled:hover:border-line"
                >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                    type="button"
                    onClick={() => scrollBy(1)}
                    disabled={atEnd}
                    aria-label="Next products"
                    className="pointer-events-auto grid h-10 w-10 place-items-center border border-line transition-colors hover:border-ink disabled:opacity-30 disabled:hover:border-line"
                >
                    <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
            </div>
        </div>
    );
}
