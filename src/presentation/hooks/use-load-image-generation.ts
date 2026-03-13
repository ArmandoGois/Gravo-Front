import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getImageGenerationDetailsUseCase } from "@/application/features/image/use-cases/get-image-generation-details.use-case";
import { Message } from "@/domain/entities/message.entity";
import { useMessageUIStore } from "@/infrastructure/stores/message-ui.store";

export const useLoadImageGeneration = (generationId: string | null, isImageTabActive: boolean) => {
    const { setMessages } = useMessageUIStore();

    const { data, isLoading, error } = useQuery({
        queryKey: ['image-generation-details', generationId],
        queryFn: () => getImageGenerationDetailsUseCase(generationId ?? ""),
        enabled: !!generationId && isImageTabActive,
        staleTime: 1000 * 60 * 30,
    });

    useEffect(() => {
        if (data && isImageTabActive) {

            const messages: Message[] = [];

            messages.push({
                id: `prompt-${data.id}`,
                role: 'user',
                content: data.prompt,
                created_at: data.created_at,
                conversation_id: data.id,
                model: data.model
            });

            if (data.generated_images && data.generated_images.length > 0) {
                messages.push({
                    id: `image-${data.id}`,
                    role: 'assistant',
                    content: {
                        type: 'image',
                        text: data.generated_images[0].url
                    },
                    created_at: data.created_at,
                    conversation_id: data.id,
                    model: data.model
                });
            }

            setMessages(messages);
        }
    }, [data, isImageTabActive, setMessages]);

    return { isLoading, error };
};