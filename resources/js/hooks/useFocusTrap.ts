import { RefObject, useEffect } from 'react';

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab inside an open overlay and returns focus where it came from.
 */
export function useFocusTrap(
    ref: RefObject<HTMLElement>,
    active: boolean,
): void {
    useEffect(() => {
        if (!active || !ref.current) {
            return;
        }

        const container = ref.current;
        const previous = document.activeElement as HTMLElement | null;

        container.querySelector<HTMLElement>(FOCUSABLE)?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') {
                return;
            }

            const focusable = Array.from(
                container.querySelectorAll<HTMLElement>(FOCUSABLE),
            );

            if (focusable.length === 0) {
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            previous?.focus();
        };
    }, [ref, active]);
}
