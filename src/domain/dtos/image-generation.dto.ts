export interface GenerateImageRequestDto {
    model: string;
    prompt: string;
    n?: number;            // Default: 1
    size?: string;         // Default: "2K"
    aspect_ratio?: string; // Default: "1:1"
    reference_images?: string[];
    // Optional conversation ID to associate the image generation with a specific conversation
    conversation_id?: string | null;
}

export interface GenerateImageResponseDto {
    created: number;
    data: {
        url: string;
        thinking_process?: unknown[];
    }[];
    usage?: Record<string, number>;
    credits_used?: number;
}