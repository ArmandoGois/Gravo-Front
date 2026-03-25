export interface GeneratedImageDetail {
    url: string;
    thinking_process: unknown[];
}

export interface GetImageGenerationDetailsResponseDto {
    id: string;
    user_id: string;
    model: string;
    prompt: string;
    size: string;
    aspect_ratio: string;
    reference_images: string[] | null; // Puede ser null o array de URLs
    generated_images: GeneratedImageDetail[];
    usage: {
        total_tokens: number;
        prompt_tokens: number;
        completion_tokens: number;
    };
    credits_used: number;
    status: string;
    error_message: string | null;
    created_at: string;
    updated_at: string;
}