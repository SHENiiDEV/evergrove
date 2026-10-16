import StoreLayout from '@/Layouts/StoreLayout';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <StoreLayout>
            <div className="relative flex min-h-[calc(100vh-140px)] flex-col justify-center py-12 sm:py-16 lg:py-24">
                {/* Subtle luxury ambient glow */}
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute left-1/2 top-0 h-[480px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest/5 blur-3xl" />
                </div>

                <div className="mx-auto w-full max-w-[480px] px-4 sm:px-6">
                    {children}
                </div>
            </div>
        </StoreLayout>
    );
}

