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

// Added BrandProfile interface
export interface BrandProfile {
    id: string;
    client_id: string;
    primary_colors: string[];
    secondary_colors: string[];
    accent_colors: string[];
    forbidden_colors: string[];
    typography_style: string;
    font_preferences: string;
    preferred_styles: string[];
    forbidden_styles: string[];
    mood_keywords: string[];
    preferred_aspect_ratios: string[];
    preferred_subjects: string[];
    forbidden_subjects: string[];
    style_notes: string;
    restrictions_notes: string;
    general_notes: string;
    created_at: string;
    updated_at: string;
}

// Added ClientDetails interface
export interface ClientDetails {
    client: Client;
    brand_profile: BrandProfile | null;
    reference_images_count: number;
    templates_count: number;
}