import BackgroundVideo from '@/Components/store/BackgroundVideo';
import ProductImage from '@/Components/store/ProductImage';
import Button from '@/Components/ui/Button';
import { MediaVideo, ShopImage } from '@/types/shop';

export interface EditorialContent {
    eyebrow: string;
    title: string;
    copy: string;
    image: ShopImage;
    video?: MediaVideo | null;
    link: { label: string; href: string };
}

export default function EditorialBanner({
    content,
}: {
    content: EditorialContent;
}) {
    return (
        <section className="mt-16 grid lg:mt-24 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden bg-surface lg:aspect-auto lg:min-h-[600px]">
                {content.video ? (
                    <BackgroundVideo
                        video={content.video}
                        lazy
                        objectPosition="50% 35%"
                    />
                ) : (
                    <ProductImage
                        image={content.image}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        alt=""
                    />
                )}
            </div>

            <div className="flex items-center bg-surface px-4 py-14 sm:px-8 lg:px-16">
                <div className="max-w-md">
                    <p className="u-label text-muted">{content.eyebrow}</p>
                    <h2 className="pt-4 text-display-md font-semibold uppercase">
                        {content.title}
                    </h2>
                    <p className="pt-5 text-[15px] leading-relaxed text-muted lg:text-base">
                        {content.copy}
                    </p>
                    <Button href={content.link.href} size="lg" className="mt-8">
                        {content.link.label}
                    </Button>
                </div>
            </div>
        </section>
    );
}
