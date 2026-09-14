import { cn } from '@/lib/cn';
import { imageUrl, srcSet } from '@/lib/image';
import { ShopImage } from '@/types/shop';

interface ProductImageProps {
    image: ShopImage | null;
    sizes: string;
    className?: string;
    priority?: boolean;
    alt?: string;
}

export default function ProductImage({
    image,
    sizes,
    className,
    priority = false,
    alt,
}: ProductImageProps) {
    if (!image) {
        return (
            <div className={cn('bg-surface', className)} aria-hidden="true" />
        );
    }

    return (
        <img
            src={imageUrl(image.src, 800)}
            srcSet={srcSet(image.src)}
            sizes={sizes}
            alt={alt ?? image.alt}
            width={image.width}
            height={image.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            className={cn('h-full w-full object-cover', className)}
        />
    );
}
