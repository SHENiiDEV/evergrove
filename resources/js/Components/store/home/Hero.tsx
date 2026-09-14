import BackgroundVideo from '@/Components/store/BackgroundVideo';
import ProductImage from '@/Components/store/ProductImage';
import Button from '@/Components/ui/Button';
import { MediaVideo, ShopImage } from '@/types/shop';

export interface HeroContent {
    eyebrow: string;
    title: string;
    copy: string;
    image: ShopImage;
    video?: MediaVideo | null;
    links: { label: string; href: string }[];
}

export default function Hero({ content }: { content: HeroContent }) {
    return (
        <section className="relative h-[88svh] min-h-[540px] w-full overflow-hidden bg-ink">
            {content.video ? (
                <BackgroundVideo video={content.video} priorityPoster />
            ) : (
                <ProductImage
                    image={content.image}
                    sizes="100vw"
                    priority
                    alt=""
                    className="absolute inset-0 object-cover object-[50%_25%]"
                />
            )}

            <div
                className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/35"
                aria-hidden="true"
            />

            <div className="u-container relative flex h-full flex-col justify-end pb-14 lg:pb-20">
                <div className="max-w-xl text-paper">
                    <p className="u-label pb-4 text-paper/80">
                        {content.eyebrow}
                    </p>
                    <h1 className="text-display-lg font-bold uppercase">
                        {content.title}
                    </h1>
                    <p className="max-w-md pt-4 text-[15px] leading-relaxed text-paper/85 lg:text-base">
                        {content.copy}
                    </p>

                    <div className="flex flex-wrap gap-3 pt-8">
                        {content.links.map((link, index) => (
                            <Button
                                key={link.href}
                                href={link.href}
                                variant={index === 0 ? 'inverse' : 'outline'}
                                size="lg"
                                className={
                                    index === 0
                                        ? ''
                                        : 'border-paper text-paper hover:bg-paper hover:text-ink'
                                }
                            >
                                {link.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
