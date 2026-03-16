export interface EditImageRequestDto {
    image_url: string;
    prompt: string;
    operation?: string; // "remove_background", "generative_fill", etc.
    scale?: number;
    mode?: string;
    output_resolution?: string;
    style?: string;
    reference_image_url?: string;
    light_transfer_strength?: number;
    change_background?: boolean;
    preserve_details?: boolean;
    direction?: string;
    expand_ratio?: number;
    aspect_ratio?: string;
}

export interface EditImageResponseDto {
    created: number;
    operation: string;
    data: {
        image_url: string;
        preview_url: string;
        original_url: string;
        operation: string;
        processing_time: number;
        credits_used: number;
    };
    credits_used: number;
    processing_time: number;
}