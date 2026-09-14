import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

const formatters = new Map<string, Intl.NumberFormat>();

export function formatPrice(
    value: number,
    currency: string,
    locale: string,
): string {
    const key = `${locale}:${currency}`;

    if (!formatters.has(key)) {
        formatters.set(
            key,
            new Intl.NumberFormat(locale, {
                style: 'currency',
                currency,
                minimumFractionDigits: 2,
            }),
        );
    }

    return formatters.get(key)!.format(value);
}

/**
 * Price formatter bound to the currency the backend is configured with.
 */
export function usePrice(): (value: number) => string {
    const { shop } = usePage<PageProps>().props;

    return (value: number) => formatPrice(value, shop.currency, shop.locale);
}
