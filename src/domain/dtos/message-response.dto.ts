export interface TextContent {
    type: "text";
    text: string;
}

export interface MultiModelContent {
    type: "multi_model";
    responses: {
        id: string;
        model: string;
        content: string;
        cost?: number;
    }[];
}

export interface MessageResponseDto {
    id: string;
    conversation_id: string;
    role: "user" | "assistant";
    content: TextContent | MultiModelContent | string;
    created_at: string;
    model?: string;
}