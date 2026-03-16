import { useMutation, useQueryClient } from "@tanstack/react-query";

import { generateImageVariationUseCase } from "@/application/features/image/use-cases/generate-image-upload.use-case";
import { generateImageUseCase } from "@/application/features/image/use-cases/generate-image.use-case";
import { GenerateImageRequestDto } from "@/domain/dtos/image-generation.dto";
import { useMessageUIStore } from "@/infrastructure/stores/message-ui.store";

interface GenerateImageMutationParams {
    prompt: string;
    modelId: string;
    conversationId?: string | null;
    reference_images?: (string | File)[];
}

export const useGenerateImage = () => {
    const queryClient = useQueryClient();
    const { messages, setMessages, selectedConversationId } = useMessageUIStore();

    const mutation = useMutation({
        mutationFn: (params: GenerateImageMutationParams) => {

            const payload: GenerateImageRequestDto = {
                model: params.modelId,
                prompt: params.prompt,
                conversation_id: params.conversationId ?? undefined,
                reference_images: params.reference_images,
                aspect_ratio: "1:1",
                size: "2K",
                n: 1
            };

            const hasImages = params.reference_images && params.reference_images.length > 0;

            if (hasImages) {
                return generateImageVariationUseCase(payload);
            } else {
                return generateImageUseCase(payload);
            }
        },

        onSuccess: (aiMessage) => {
            setMessages([...messages, aiMessage]);
            if (selectedConversationId) {
                queryClient.invalidateQueries({ queryKey: ["messages", selectedConversationId] });
            }
        },
        onError: (error) => {
            console.error("Failed to generate image", error);
        }
    });

    return {
        generateImage: mutation.mutate,
        isGenerating: mutation.isPending,
        error: mutation.error
    };
};