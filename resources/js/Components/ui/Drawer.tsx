import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cn } from '@/lib/cn';
import { X } from 'lucide-react';
import { ReactNode, useEffect, useRef } from 'react';

type Side = 'left' | 'right' | 'bottom';

const PANEL: Record<Side, string> = {
    left: 'left-0 top-0 h-full w-full max-w-[380px] animate-slide-in-left',
    right: 'right-0 top-0 h-full w-full max-w-[380px] animate-slide-in-right',
    bottom: 'bottom-0 left-0 max-h-[85vh] w-full animate-slide-in-bottom',
};

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    title: string;
    side?: Side;
    children: ReactNode;
    footer?: ReactNode;
}

export default function Drawer({
    open,
    onClose,
    title,
    side = 'right',
    children,
    footer,
}: DrawerProps) {
    const panel = useRef<HTMLDivElement>(null);

    useBodyScrollLock(open);
    useFocusTrap(panel, open);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 animate-fade-in bg-ink/40"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                ref={panel}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={cn(
                    'absolute flex flex-col bg-paper shadow-xl',
                    PANEL[side],
                )}
            >
                <header className="flex h-14 shrink-0 items-center justify-between border-b border-line px-5">
                    <h2 className="u-label">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="-mr-2 grid h-10 w-10 place-items-center text-ink transition-colors hover:bg-surface"
                    >
                        <X className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto overscroll-contain">
                    {children}
                </div>

                {footer ? (
                    <footer className="shrink-0 border-t border-line p-5">
                        {footer}
                    </footer>
                ) : null}
            </div>
        </div>
    );
}
