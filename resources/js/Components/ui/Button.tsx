import { cn } from '@/lib/cn';
import { Link } from '@inertiajs/react';
import { ButtonHTMLAttributes } from 'react';

type Variant = 'solid' | 'outline' | 'inverse' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const BASE =
    'inline-flex items-center justify-center gap-2 rounded font-semibold uppercase leading-none tracking-label transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-40';

const VARIANTS: Record<Variant, string> = {
    solid: 'bg-ink text-paper hover:bg-ink/85',
    outline: 'border border-ink text-ink hover:bg-ink hover:text-paper',
    inverse: 'bg-paper text-ink hover:bg-paper/85',
    ghost: 'text-ink hover:bg-surface',
};

const SIZES: Record<Size, string> = {
    sm: 'h-9 px-4 text-[11px]',
    md: 'h-11 px-6 text-[11px]',
    lg: 'h-14 px-8 text-xs',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    fullWidth?: boolean;
    href?: string;
}

export default function Button({
    variant = 'solid',
    size = 'md',
    fullWidth = false,
    href,
    className,
    children,
    ...props
}: ButtonProps) {
    const classes = cn(
        BASE,
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
    );

    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}
