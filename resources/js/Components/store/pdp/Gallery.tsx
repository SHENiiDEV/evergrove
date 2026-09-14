import ProductImage from '@/Components/store/ProductImage';
import { cn } from '@/lib/cn';
import { ShopImage } from '@/types/shop';
import { useCallback, useRef, useState } from 'react';

export default function Gallery({
    images,
    title,
}: {
    images: ShopImage[];
    title: string;
}) {
    const track = useRef<HTMLUListElement>(null);
    const [active, setActive] = useState(0);

    const onScroll = useCallback(() => {
        const node = track.current;

        if (node) {
            setActive(Math.round(node.scrollLeft / node.clientWidth));
        }
    }, []);

    const goTo = (index: number) => {
        const node = track.current;

        if (node) {
            node.scrollTo({
                left: index * node.clientWidth,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div>
            {/* Mobile: swipeable carousel */}
            <div className="relative lg:hidden">
                <ul
                    ref={track}
                    onScroll={onScroll}
                    className="u-no-scrollbar u-snap-x -mx-4 flex overflow-x-auto sm:-mx-6"
                >
                    {images.map((image, index) => (
                        <li
                            key={image.src}
                            className="u-snap-start w-full shrink-0"
                        >
                            <div className="aspect-[4/5] bg-surface">
                                <ProductImage
                                    image={image}
                                    sizes="100vw"
                                    priority={index === 0}
                                    alt={
                                        index === 0
                                            ? image.alt
                                            : `${title}, view ${index + 1}`
                                    }
                                />
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="flex justify-center gap-1.5 pt-4">
                    {images.map((image, index) => (
                        <button
                            key={image.src}
                            type="button"
                            onClick={() => goTo(index)}
                            aria-label={`Go to image ${index + 1}`}
                            aria-current={index === active ? 'true' : undefined}
                            className={cn(
                                'h-1.5 rounded-full transition-all duration-300',
                                index === active
                                    ? 'w-6 bg-ink'
                                    : 'w-1.5 bg-line',
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Desktop: the full set, two up */}
            <ul className="hidden gap-1 lg:grid lg:grid-cols-2">
                {images.map((image, index) => (
                    <li key={image.src} className="bg-surface">
                        <div className="aspect-[4/5]">
                            <ProductImage
                                image={image}
                                sizes="(min-width: 1024px) 31vw, 50vw"
                                priority={index < 2}
                                alt={
                                    index === 0
                                        ? image.alt
                                        : `${title}, view ${index + 1}`
                                }
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
