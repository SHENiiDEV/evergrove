export interface MediaVideo {
    desktop: string;
    mobile: string;
    poster: string;
}

export interface ShopImage {
    src: string;
    alt: string;
    width: number;
    height: number;
}

export interface ProductColor {
    name: string;
    slug: string;
    hex: string;
    family: string;
}

export interface ProductSize {
    label: string;
    sku: string;
    variantId: number;
    available: boolean;
}

export interface ProductCategory {
    slug: string;
    label: string;
}

export type ProductBadge = 'new' | 'sale' | 'sold-out' | 'low-stock';

export type Gender = 'men' | 'women';

export interface ProductCard {
    id: string;
    groupId: number;
    title: string;
    handle: string;
    url: string;
    price: number;
    compareAtPrice: number | null;
    image: ShopImage | null;
    hoverImage: ShopImage | null;
    color: ProductColor;
    sizes: ProductSize[];
    available: boolean;
    badges: ProductBadge[];
    gender: Gender;
    category: ProductCategory;
    colorways?: ProductCard[];
}

export interface Product extends ProductCard {
    descriptionHtml: string;
    images: ShopImage[];
    publishedAt: string;
    vendor: string;
    tags: string[];
}

export interface Facet {
    value: string;
    label: string;
    count: number;
    hex?: string;
}

export interface CatalogFacets {
    category: Facet[];
    size: Facet[];
    color: Facet[];
    price: Facet[];
}

export interface CatalogFilters {
    category: string[];
    size: string[];
    color: string[];
    price: string[];
}

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc';

export interface SortOption {
    value: SortKey;
    label: string;
}

export interface Breadcrumb {
    label: string;
    href?: string;
}

export interface NavChild {
    label: string;
    href: string;
}

export interface NavColumn {
    heading: string;
    items: NavChild[];
}

export interface NavFeature {
    label: string;
    caption: string;
    href: string;
    image: string;
}

export interface NavItem {
    label: string;
    href: string;
    columns?: NavColumn[];
    feature?: NavFeature;
}

export interface ShopConfig {
    currency: string;
    locale: string;
    name: string;
}

export interface CompanyConfig {
    name: string;
    number: string;
    address: string;
    email: string;
}
