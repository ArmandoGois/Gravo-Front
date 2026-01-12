import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getConversationsUseCase } from "@/application/features/conversations/use-cases/get-conversations.use-case";
import { useConversationUIStore } from "@/infrastructure/stores/conversation-ui.store";
import { useModels } from "@/presentation/hooks/use-models";

export const useConversations = () => {
    const { setConversations } = useConversationUIStore();

    const { models: availableModels, isLoading: isLoadingModels } = useModels();

    const { data: conversationsData, isLoading: isLoadingConversations } = useQuery({
        queryKey: ["conversations"],
        queryFn: () => getConversationsUseCase({ archived: false }),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (conversationsData && availableModels.length > 0) {

            const mappedConversations = conversationsData.map((conv) => {
                const foundModel = availableModels.find(m => m.id === conv.model_id);

                const modelsArray = foundModel ? [foundModel] : [];

                return {
                    id: conv.id,
                    title: conv.title || "Untitled Chat",
                    models: modelsArray,
                    createdAt: new Date(conv.created_at)
                };
            });

            setConversations(mappedConversations);
        }
    }, [conversationsData, availableModels, setConversations]);

    return {
        isLoading: isLoadingConversations || isLoadingModels
    };
};