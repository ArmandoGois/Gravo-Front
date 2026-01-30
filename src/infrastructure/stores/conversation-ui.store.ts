// @/infrastructure/stores/chat-ui.store.ts
import { create } from "zustand";

import type { AIModel } from "@/domain/entities/model.entity";

export interface ConversationSession {
    id: string;
    title: string;
    models: AIModel[];
    createdAt: Date;
}

interface ConversationUIState {
    activeConversations: ConversationSession[];
    addConversation: (title: string, selectedModels: AIModel[], id?: string) => void;
    removeConversation: (ConversationId: string) => void;
    setConversations: (conversations: ConversationSession[]) => void;
}

export const useConversationUIStore = create<ConversationUIState>((set) => ({
    activeConversations: [],

    addConversation: (title, selectedModels, id) => set((state) => ({
        activeConversations: [
            {
                id: id || crypto.randomUUID(),
                title: title || "Untitled Conversation",
                models: selectedModels,
                createdAt: new Date(),
            },
            ...state.activeConversations,
        ],
    })),

    removeConversation: (conversationId) => set((state) => ({
        activeConversations: state.activeConversations.filter((c) => c.id !== conversationId),
    })),

    setConversations: (conversations) => set({
        activeConversations: conversations
    }),
}));