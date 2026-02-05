export interface GeneratedImageItem {
    url: string;
    thinking_process: unknown[];
}

export interface ImageHistoryItemDto {
    id: string;
    model: string;
    prompt: string;
    size: string;
    aspect_ratio: string;
    generated_images: GeneratedImageItem[];
    usage: {
        total_tokens: number;
        prompt_tokens: number;
        completion_tokens: number;
    };
    credits_used: number;
    created_at: string;
}

export interface GetImageHistoryResponseDto {
    data: ImageHistoryItemDto[];
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
}