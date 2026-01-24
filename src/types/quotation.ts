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

export type { Quotation, QuotationForm, ClientForm, CompanyForm, DueDates };