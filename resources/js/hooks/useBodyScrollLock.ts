import { useEffect } from 'react';

/**
 * Freezes the page behind overlays without the layout shifting when the
 * scrollbar disappears.
 */
export function useBodyScrollLock(locked: boolean): void {
    useEffect(() => {
        if (!locked) {
            return;
        }

        const { body, documentElement } = document;
        const previousOverflow = body.style.overflow;
        const previousPadding = body.style.paddingRight;
        const gap = window.innerWidth - documentElement.clientWidth;

        body.style.overflow = 'hidden';

        if (gap > 0) {
            body.style.paddingRight = `${gap}px`;
        }

        return () => {
            body.style.overflow = previousOverflow;
            body.style.paddingRight = previousPadding;
        };
    }, [locked]);
}
