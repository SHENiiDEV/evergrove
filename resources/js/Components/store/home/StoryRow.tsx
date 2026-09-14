import ProductImage from '@/Components/store/ProductImage';
import SectionHeading from '@/Components/store/SectionHeading';
import { ShopImage } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

export interface Story {
    title: string;
    caption: string;
    href: string;
    image: ShopImage;
}

export default function StoryRow({ stories }: { stories: Story[] }) {
    return (
        <section className="u-container pt-16 lg:pt-24">
            <SectionHeading title="Read up" eyebrow="Guides" />

            <ul className="grid gap-x-3 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-4">
                {stories.map((story) => (
                    <li key={story.title}>
                        <Link href={story.href} className="group block">
                            <div className="aspect-[4/3] overflow-hidden bg-surface">
                                <ProductImage
                                    image={story.image}
                                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
                                    alt=""
                                    className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                />
                            </div>

                            <h3 className="flex items-start gap-1 pt-4 font-display text-xl font-semibold uppercase">
                                {story.title}
                                <ArrowUpRight
                                    className="mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    strokeWidth={2}
                                />
                            </h3>
                            <p className="pt-1.5 text-sm leading-relaxed text-muted">
                                {story.caption}
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
