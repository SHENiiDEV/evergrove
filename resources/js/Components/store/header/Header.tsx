import AnnouncementBar from '@/Components/store/header/AnnouncementBar';
import MegaMenu from '@/Components/store/header/MegaMenu';
import MobileNav from '@/Components/store/header/MobileNav';
import SearchOverlay from '@/Components/store/header/SearchOverlay';
import { useCart } from '@/Context/CartContext';
import { cn } from '@/lib/cn';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Header({
    transparent = false,
}: {
    transparent?: boolean;
}) {
    const { navigation, auth, shop } = usePage<PageProps>().props;
    const { openCart, itemCount } = useCart();

    const [scrolled, setScrolled] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const closeTimer = useRef<number | undefined>(undefined);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const solid = !transparent || scrolled || openMenu !== null;
    const activeItem = navigation.find((item) => item.label === openMenu);

    const hoverOpen = (label: string) => {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => setOpenMenu(label), 120);
    };

    const hoverClose = () => {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => setOpenMenu(null), 120);
    };

    const iconButton =
        'grid h-10 w-10 place-items-center transition-opacity hover:opacity-60';

    return (
        <>
            <AnnouncementBar />

            <header
                onMouseLeave={hoverClose}
                className={cn(
                    'sticky top-0 z-40 transition-colors duration-300 ease-out',
                    solid
                        ? 'border-b border-line bg-paper text-ink'
                        : 'bg-transparent text-paper',
                )}
            >
                <div className="u-container flex h-14 items-center justify-between gap-4 lg:h-[68px]">
                    <div className="flex flex-1 items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open menu"
                            className={cn(iconButton, '-ml-2 lg:hidden')}
                        >
                            <Menu className="h-5 w-5" strokeWidth={1.5} />
                        </button>

                        <nav aria-label="Main" className="hidden lg:block">
                            <ul className="flex items-center gap-7">
                                {navigation.map((item) => (
                                    <li
                                        key={item.label}
                                        onMouseEnter={() =>
                                            hoverOpen(item.label)
                                        }
                                    >
                                        <Link
                                            href={item.href}
                                            onFocus={() =>
                                                setOpenMenu(item.label)
                                            }
                                            className={cn(
                                                'u-label relative block py-6 after:absolute after:bottom-4 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100',
                                                openMenu === item.label &&
                                                    'after:scale-x-100',
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <Link
                        href={route('home')}
                        className="shrink-0 font-display text-xl font-bold uppercase leading-none tracking-[-0.01em] lg:text-2xl"
                    >
                        {shop.name}
                    </Link>

                    <div className="flex flex-1 items-center justify-end gap-0.5">
                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            aria-label="Search"
                            className={iconButton}
                        >
                            <Search className="h-5 w-5" strokeWidth={1.5} />
                        </button>

                        <Link
                            href={
                                auth.user ? route('dashboard') : route('login')
                            }
                            aria-label={auth.user ? 'Account' : 'Sign in'}
                            className={cn(iconButton, 'hidden sm:grid')}
                        >
                            <User className="h-5 w-5" strokeWidth={1.5} />
                        </Link>

                        <button
                            type="button"
                            aria-label="Wishlist"
                            className={cn(iconButton, 'hidden sm:grid')}
                        >
                            <Heart className="h-5 w-5" strokeWidth={1.5} />
                        </button>

                        <button
                            type="button"
                            onClick={openCart}
                            aria-label={`Bag, ${itemCount} items`}
                            className={cn(iconButton, '-mr-2 relative')}
                        >
                            <ShoppingBag
                                className="h-5 w-5"
                                strokeWidth={1.5}
                            />
                            {itemCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink text-paper text-[10px] font-bold px-1 ring-1 ring-paper">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {activeItem ? (
                    <MegaMenu
                        item={activeItem}
                        onNavigate={() => setOpenMenu(null)}
                    />
                ) : null}
            </header>

            <MobileNav
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                items={navigation}
            />
            <SearchOverlay
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
            />
        </>
    );
}
