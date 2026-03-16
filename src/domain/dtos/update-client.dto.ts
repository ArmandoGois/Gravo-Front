export interface UpdateClientRequestDto {
    name: string;
    slug: string;
    description: string;
    website: string;
    industry: string;
    is_active: boolean;
    logo_url?: string;
}