export type TenantSettingsCompany = {
    name: string;
    address: string;
    phone: string;
    city: string;
    fiscal_number: string;
    email: string;
}

export type TenantSettings = {
    logo_url: string | null;
    logo_base64: string | null;
    primary_color: string | null;
    secondary_color: string | null;
    template: string;
    currency: string;
    locale: string;
    company: TenantSettingsCompany;
}

export type TenantSettingsUpdatePayload = {
    logo_url?: string | null;
    logo_base64?: string | null;
    primary_color?: string | null;
    secondary_color?: string | null;
    template?: string;
    currency?: string;
    locale?: string;
    company?: Partial<TenantSettingsCompany>;
}
