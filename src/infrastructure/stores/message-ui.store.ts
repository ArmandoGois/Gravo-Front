import { create } from "zustand";

import type { Message } from "@/domain/entities/message.entity";

interface MessageUIState {
    selectedConversationId: string | null;
    messages: Message[];
    isLoadingMessages: boolean;

    selectConversation: (id: string | null) => void;
    setMessages: (messages: Message[]) => void;
    setLoadingMessages: (loading: boolean) => void;
}

export const useMessageUIStore = create<MessageUIState>((set) => ({
    selectedConversationId: null,
    messages: [],
    isLoadingMessages: false,

    selectConversation: (id) => set({
        selectedConversationId: id,
        messages: [],
        isLoadingMessages: !!id
    }),

    setMessages: (messages) => set({ messages }),
    setLoadingMessages: (loading) => set({ isLoadingMessages: loading }),
}));