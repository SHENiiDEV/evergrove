import { CompanyConfig, NavColumn, NavItem, ShopConfig } from './shop';

export interface User {
    id: number;
    name: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    phone?: string | null;
    date_of_birth?: string | null;
    address_line1?: string | null;
    city?: string | null;
    country?: string | null;
    postal_code?: string | null;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    shop: ShopConfig;
    company: CompanyConfig;
    navigation: NavItem[];
    footerColumns: NavColumn[];
};
