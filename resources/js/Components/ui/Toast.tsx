import { cn } from '@/lib/cn';
import { Check, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
    open: boolean;
    message: string;
    onClose: () => void;
}

export default function Toast({ open, message, onClose }: ToastProps) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const timer = window.setTimeout(onClose, 4000);

        return () => window.clearTimeout(timer);
    }, [open, onClose]);

    return (
        <div
            aria-live="polite"
            className={cn(
                'pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center transition-all duration-300 ease-out sm:inset-x-auto sm:right-6',
                open
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-4 opacity-0',
            )}
        >
            {open ? (
                <div className="pointer-events-auto flex items-center gap-3 bg-ink px-5 py-4 text-paper shadow-lg">
                    <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
                    <p className="text-sm">{message}</p>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Dismiss"
                        className="-mr-1 opacity-70 hover:opacity-100"
                    >
                        <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                </div>
            ) : null}
        </div>
    );
}
