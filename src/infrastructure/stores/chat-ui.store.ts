// @/infrastructure/stores/chat-ui.store.ts
import { create } from "zustand";

import type { AIModel } from "@/domain/entities/model.entity";

export interface ChatSession {
    id: string;
    title: string;
    models: AIModel[];
    createdAt: Date;
}

interface ChatUIState {
    activeChats: ChatSession[];
    addChat: (title: string, selectedModels: AIModel[], id?: string) => void;
    removeChat: (chatId: string) => void;
}

export const useChatUIStore = create<ChatUIState>((set) => ({
    activeChats: [],

    addChat: (title, selectedModels, id) => set((state) => ({
        activeChats: [
            {
                id: id || crypto.randomUUID(),
                title: title || "Untitled Chat",
                models: selectedModels,
                createdAt: new Date(),
            },
            ...state.activeChats,
        ],
    })),

    removeChat: (chatId) => set((state) => ({
        activeChats: state.activeChats.filter((c) => c.id !== chatId),
    })),
}));