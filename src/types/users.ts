export interface UserType {
    id : number;
    name : string;
    email : string;
    email_verified_at : boolean | null;
    created_at : string;
    updated_at : string;
    tenant_id : number;
    is_admin : boolean | null;
}