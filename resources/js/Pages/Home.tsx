import CategoryTiles, {
    CategoryTile,
} from '@/Components/store/home/CategoryTiles';
import EditorialBanner, {
    EditorialContent,
} from '@/Components/store/home/EditorialBanner';
import Hero, { HeroContent } from '@/Components/store/home/Hero';
import StoryRow, { Story } from '@/Components/store/home/StoryRow';
import UspStrip from '@/Components/store/home/UspStrip';
import ProductGrid from '@/Components/store/ProductGrid';
import ProductRail from '@/Components/store/ProductRail';
import SectionHeading from '@/Components/store/SectionHeading';
import StoreLayout from '@/Layouts/StoreLayout';
import { Gender, ProductCard } from '@/types/shop';
import { Head } from '@inertiajs/react';

interface HomeProps {
    hero: HeroContent;
    newIn: ProductCard[];
    categoryTiles: Record<Gender, CategoryTile[]>;
    editorial: EditorialContent;
    bestSellers: ProductCard[];
    stories: Story[];
}

export default function Home({
    hero,
    newIn,
    categoryTiles,
    editorial,
    bestSellers,
    stories,
}: HomeProps) {
    return (
        <StoreLayout transparentHeader>
            <Head title="Training kit built to last" />

            <Hero content={hero} />

            <section className="u-container pt-16 lg:pt-24">
                <SectionHeading
                    title="New in"
                    eyebrow="Just landed"
                    href={route('catalog', { sort: 'newest' })}
                />
                <ProductRail products={newIn} />
            </section>

            <CategoryTiles tiles={categoryTiles} />

            <EditorialBanner content={editorial} />

            <section className="u-container pt-16 lg:pt-24">
                <SectionHeading
                    title="Popular right now"
                    eyebrow="Best sellers"
                    href={route('catalog')}
                />
                <ProductGrid
                    products={bestSellers}
                    className="xl:grid-cols-5"
                />
            </section>

            <StoryRow stories={stories} />

            <UspStrip />
        </StoreLayout>
    );
}
