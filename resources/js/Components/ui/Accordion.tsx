import { cn } from '@/lib/cn';
import { Minus, Plus } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface AccordionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export default function Accordion({
    title,
    children,
    defaultOpen = false,
    className,
}: AccordionProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className={cn('border-b border-line', className)}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
                <span className="u-label">{title}</span>
                {open ? (
                    <Minus className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                ) : (
                    <Plus className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                )}
            </button>

            {open ? (
                <div className="animate-slide-down pb-5 text-[15px] leading-relaxed text-muted">
                    {children}
                </div>
            ) : null}
        </div>
    );
}
