interface Client {
    name: string,
    address: string,
    phone: string,
    fiscal_number: string,
    city: string,
    email: string
}
type ClientForm = Partial<Client>;
interface Company {
    name: string,
    address: string,
    phone: string,
    fiscal_number: string,
    city: string,
    email: string
}
type CompanyForm = Partial<Company>;
interface Quotation {
    number: number;
    date: Date;
    logo: File,
    due_date_id: string,
    client: Client
    company: Company
    notes: string,
    terms: string,
    primaryColor: string,
    secundaryColor: string,
    template: string,
}

interface QuotationForm {
    number?: number;
    date?: Date;
    logo?: File,
    due_date_id?: string,
    client?: Client
    company?: Company
    notes?: string,
    terms?: string,
    primaryColor?: string,
    secundaryColor?: string,
    template?: string,
}

interface DueDates {
    created_at : string;
    due_in_days : number;
    id : number;
    name : string;
    unique_id : string;
    updated_at : string;
}

export type QuotationListItem = {
    id: number;
    number: string;
    date: string;
    due_date: string;
    client_name: string;
    company_name: string;
    currency: string;
    total: number;
    notes: string | null;
    created_at: string;
}

export type QuotationProduct = {
    name: string;
    description?: string;
    unit_of_measurement?: string;
    unit_price: number;
    discount_percentage: number;
    tax_percentage: number;
    quantity: number;
}

export type QuotationUpdatePayload = {
    number?: string;
    date?: string;
    due_date?: string;
    locale?: 'en' | 'es';
    currency?: string;
    notes?: string;
    terms?: string;
    discount?: number;
    is_flat_discount?: boolean;
    tax?: number;
    client?: ClientForm;
    company?: CompanyForm;
    products?: QuotationProduct[];
}

export type QuotationDetail = {
    id: number;
    number: string;
    date: string;
    due_date: string;
    currency: string;
    locale: string;
    notes: string | null;
    terms: string | null;
    discount: number;
    is_flat_discount: boolean;
    tax: number;
    client: Client;
    company: Company;
    products: QuotationProduct[];
}

export type { Quotation, QuotationForm, ClientForm, CompanyForm, DueDates };