import { CompanyConfig, NavColumn, NavItem, ShopConfig } from './shop';

export interface User {
    id: number;
    name: string;
    email: string;
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
