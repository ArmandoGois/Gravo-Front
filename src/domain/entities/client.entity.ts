export interface Client {
    id: string;
    organization_id: string;
    name: string;
    slug: string;
    description: string;
    logo_url: string;
    website: string;
    industry: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    created_by: string;
}