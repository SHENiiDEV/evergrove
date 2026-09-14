const DEFAULT_WIDTHS = [320, 480, 640, 800, 1080, 1440, 1920];

/**
 * Shopify's CDN resizes on the fly via ?width=. Once the photography is served
 * locally, only these two helpers need to change.
 */
export function imageUrl(src: string, width: number): string {
    return `${src}${src.includes('?') ? '&' : '?'}width=${width}`;
}

export function srcSet(src: string, widths: number[] = DEFAULT_WIDTHS): string {
    return widths
        .map((width) => `${imageUrl(src, width)} ${width}w`)
        .join(', ');
}
