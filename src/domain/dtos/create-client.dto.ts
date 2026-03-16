export interface CreateClientRequestDto {
    name: string;
    slug: string;
    description: string;
    website: string;
    industry: string;
    logo_url?: string;
}