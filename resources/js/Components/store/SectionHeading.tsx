import { cn } from '@/lib/cn';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface SectionHeadingProps {
    title: string;
    eyebrow?: string;
    href?: string;
    linkLabel?: string;
    className?: string;
}

export default function SectionHeading({
    title,
    eyebrow,
    href,
    linkLabel = 'View all',
    className,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                'flex items-end justify-between gap-6 pb-5',
                className,
            )}
        >
            <div className="flex flex-col gap-2">
                {eyebrow ? (
                    <p className="u-label text-muted">{eyebrow}</p>
                ) : null}
                <h2 className="text-display-sm font-semibold uppercase">
                    {title}
                </h2>
            </div>

            {href ? (
                <Link
                    href={href}
                    className="u-label u-link-underline hidden shrink-0 items-center gap-1.5 sm:inline-flex"
                >
                    {linkLabel}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </Link>
            ) : null}
        </div>
    );
}
