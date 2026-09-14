import CartDrawer from '@/Components/store/cart/CartDrawer';
import Footer from '@/Components/store/Footer';
import Header from '@/Components/store/header/Header';
import { cn } from '@/lib/cn';
import { PropsWithChildren } from 'react';

interface StoreLayoutProps {
    /** Lets a full-bleed hero sit underneath a transparent header. */
    transparentHeader?: boolean;
}

export default function StoreLayout({
    transparentHeader = false,
    children,
}: PropsWithChildren<StoreLayoutProps>) {
    return (
        <div className="flex min-h-screen flex-col bg-paper">
            <Header transparent={transparentHeader} />

            <main
                className={cn(
                    'flex-1',
                    transparentHeader && '-mt-14 lg:-mt-[68px]',
                )}
            >
                {children}
            </main>

            <Footer />
            <CartDrawer />
        </div>
    );
}
