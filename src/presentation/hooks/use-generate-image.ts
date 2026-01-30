import { useMutation, useQueryClient } from "@tanstack/react-query";

import { generateImageUseCase } from "@/application/features/image/use-cases/generate-image.use-case";
import { GenerateImageRequestDto } from "@/domain/dtos/image-generation.dto";
import { useMessageUIStore } from "@/infrastructure/stores/message-ui.store";

export const useGenerateImage = () => {
    const queryClient = useQueryClient();
    const { messages, setMessages, selectedConversationId } = useMessageUIStore();

    const mutation = useMutation({
        mutationFn: (params: { prompt: string; modelId: string; conversationId?: string | null }) => {

            const payload: GenerateImageRequestDto = {
                model: params.modelId,
                prompt: params.prompt,
                conversation_id: params.conversationId,
                // Aquí puedes agregar controles de UI para aspect_ratio si los implementas luego
                aspect_ratio: "1:1",
                size: "2K",
                n: 1
            };

            return generateImageUseCase(payload);
        },

        onSuccess: (aiMessage) => {
            // Agregamos el mensaje con la imagen al chat
            setMessages([...messages, aiMessage]);

            // Invalidamos la query de mensajes para asegurar consistencia si recargas
            if (selectedConversationId) {
                queryClient.invalidateQueries({ queryKey: ["messages", selectedConversationId] });
            }
        },

        onError: (error) => {
            console.error("Failed to generate image", error);
            // Aquí podrías disparar un Toast de error
        }
    });

    return {
        generateImage: mutation.mutate,
        isGenerating: mutation.isPending,
        error: mutation.error
    };
};