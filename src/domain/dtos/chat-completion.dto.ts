export interface MultiModelConfig {
    mode: string;
    timeout_per_model: number;
    stop_on_first_error: boolean;
    aggregate_responses: boolean;
}

export interface ChatRequestDto {
    model: string | string[];
    messages: {
        role: "user" | "assistant";
        content: {
            text: string | null;
            type: "text" | string;
            image: string | null;
            image_url: string | { additionalProperties: string } | null;
            video_url?: string | null;
        }[] | string;
    }[];
    organization_id?: string | null;
    stream?: boolean;
    max_tokens?: number | null;
    temperature?: number | null;
    top_p?: number | null;
    multi_model_config?: MultiModelConfig | null;
    conversation_id?: string | null;
}

export interface ChatCompletionResponse { //Simplified response interface
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index?: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason?: string;
    }>;
    conversation_id: string;
}