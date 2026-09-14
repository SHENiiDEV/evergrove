import { cn } from '@/lib/cn';
import { MediaVideo } from '@/types/shop';
import { useEffect, useRef, useState } from 'react';

interface BackgroundVideoProps {
    video: MediaVideo;
    /** Wait until the section is near the viewport before fetching. */
    lazy?: boolean;
    /** The poster is the LCP candidate above the fold. */
    priorityPoster?: boolean;
    objectPosition?: string;
    className?: string;
}

/**
 * Decorative looping footage behind a section. The poster is painted first and
 * the video fades in once it is actually playing, so there is no pop. Visitors
 * who asked for reduced motion, or who are on a data saver, only ever get the
 * poster.
 */
export default function BackgroundVideo({
    video,
    lazy = false,
    priorityPoster = false,
    objectPosition,
    className,
}: BackgroundVideoProps) {
    const wrapper = useRef<HTMLDivElement>(null);
    const player = useRef<HTMLVideoElement>(null);
    const [inView, setInView] = useState(!lazy);
    const [source, setSource] = useState<string | null>(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        if (!lazy || !wrapper.current) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { rootMargin: '300px' },
        );

        observer.observe(wrapper.current);

        return () => observer.disconnect();
    }, [lazy]);

    // Chosen once, then sticky: leaving the viewport pauses playback rather
    // than throwing the download away.
    useEffect(() => {
        if (source || !inView) {
            return;
        }

        const saveData = (
            navigator as Navigator & { connection?: { saveData?: boolean } }
        ).connection?.saveData;

        if (
            saveData ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return;
        }

        setSource(
            window.matchMedia('(min-width: 768px)').matches
                ? video.desktop
                : video.mobile,
        );
    }, [inView, source, video]);

    useEffect(() => {
        const node = player.current;

        if (!node || !source) {
            return;
        }

        if (inView) {
            node.play().catch(() => undefined);
        } else {
            node.pause();
        }
    }, [inView, source]);

    return (
        <div ref={wrapper} className={cn('absolute inset-0', className)}>
            <img
                src={video.poster}
                alt=""
                width={1280}
                height={720}
                loading={priorityPoster ? 'eager' : 'lazy'}
                fetchPriority={priorityPoster ? 'high' : 'auto'}
                style={objectPosition ? { objectPosition } : undefined}
                className="h-full w-full object-cover"
            />

            {source ? (
                <video
                    ref={player}
                    src={source}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    tabIndex={-1}
                    onPlaying={() => setPlaying(true)}
                    style={objectPosition ? { objectPosition } : undefined}
                    className={cn(
                        'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out',
                        playing ? 'opacity-100' : 'opacity-0',
                    )}
                />
            ) : null}
        </div>
    );
}
