import { useMutation } from "@tanstack/react-query";

import { editImageUseCase } from "@/application/features/image/use-cases/edit-image.use-case";
import { EditImageResponseDto } from "@/domain/dtos/edit-image.dto";
import { Message } from "@/domain/entities/message.entity";
import { useMessageUIStore } from "@/infrastructure/stores/message-ui.store";

export const useEditImage = () => {
    const { messages, setMessages, selectedConversationId } = useMessageUIStore();

    const mutation = useMutation({
        mutationFn: async ({ prompt, operation = "generate_with_reference" }: { prompt: string, operation?: string }) => {

            const lastImageMessage = [...messages].reverse().find(
                msg => msg.role === 'assistant' &&
                    (typeof msg.content === 'object' && msg.content?.type === 'image')
            );

            if (!lastImageMessage || typeof lastImageMessage.content === 'string') {
                throw new Error("No hay imagen previa para editar.");
            }

            const sourceImageUrl = lastImageMessage.content.text;

            let selectedOperation = operation;
            if (prompt.toLowerCase().includes("fondo") || prompt.toLowerCase().includes("background")) {
                selectedOperation = "remove_background";
            }

            return await editImageUseCase({
                image_url: sourceImageUrl,
                reference_image_url: sourceImageUrl,
                prompt,
                operation: selectedOperation,
                output_resolution: "full"
            });
        },
        onSuccess: (response: EditImageResponseDto) => {
            const newImageUrl = response.data?.image_url;

            if (newImageUrl) {
                const assistantMessage: Message = {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: {
                        type: 'image',
                        text: newImageUrl
                    },
                    created_at: new Date().toISOString(),
                    conversation_id: selectedConversationId || "temp",
                    model: "image-editor-v1"
                };

                setMessages([...messages, assistantMessage]);
            }
        },
        onError: (error) => {
            console.error("Failed to edit image:", error);
        }
    });

    return {
        editImage: mutation.mutate,
        isEditing: mutation.isPending,
        error: mutation.error
    };
};