export interface MessageContentPayload {
    text: string;
    type: "text" | string;
}

export interface Message {
    id: string;
    conversation_id: string;
    role: "user" | "assistant";
    content: string | MessageContentPayload;
    media_files: string[];
    tokens_used: number | null;
    cost: number | null;
    generation_time_ms: number | null;
    created_at: string;
}