export interface CreateBrandProfileRequestDto {
    colors: {
        primary: string[];
        secondary: string[];
        accent: string[];
        forbidden: string[];
    };
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
}