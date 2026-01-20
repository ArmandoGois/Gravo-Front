import { AIModel } from "./model.entity";

export interface Conversation {
    id: string;
    user_id: string | null;
    title: string;
    models: AIModel[];
    createdAt: Date;
}