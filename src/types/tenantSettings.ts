export type TenantSettingsCompany = {
    name: string;
    address: string;
    phone: string;
    city: string;
    fiscal_number: string;
    email: string;
}

export type TenantSettingsQuotation = {
    notes_default: string | null;
    terms_default: string | null;
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
    quotation?: TenantSettingsQuotation;
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
    quotation?: Partial<TenantSettingsQuotation>;
}
