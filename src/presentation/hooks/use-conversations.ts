import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getConversationsUseCase } from "@/application/features/conversations/use-cases/get-conversations.use-case";
import { useConversationUIStore } from "@/infrastructure/stores/conversation-ui.store";

export const useConversations = () => {
    const { setConversations } = useConversationUIStore();

    const { data: conversationsData, isLoading: isLoadingConversations } = useQuery({
        queryKey: ["conversations"],
        queryFn: () => getConversationsUseCase({ archived: false }),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (conversationsData) {
            setConversations(conversationsData);
        }
    }, [conversationsData, setConversations]);

    return {
        isLoading: isLoadingConversations
    };
}