import type { GenerateImageRequestDto, GenerateImageResponseDto } from "@/domain/dtos/image-generation.dto";
import type { Message, MessageContentPayload } from "@/domain/entities/message.entity";
import { httpService } from "@/infrastructure/services/http.service";

export const generateImageUseCase = async (
    params: GenerateImageRequestDto
): Promise<Message> => {
    try {
        const payload: GenerateImageRequestDto = {
            model: params.model,
            prompt: params.prompt,
            n: params.n ?? 1,
            size: params.size ?? "2K",
            aspect_ratio: params.aspect_ratio ?? "1:1",
            reference_images: params.reference_images ?? [],
            conversation_id: params.conversation_id
        };

        const response = await httpService.post<GenerateImageResponseDto>("/v1/images/generations", payload);

        const imageData = response.data?.[0];
        if (!imageData || !imageData.url) {
            throw new Error("No image URL received from backend");
        }

        const contentPayload: MessageContentPayload = {
            type: "text",
            text: `Here is your generated image:\n\n![Generated Image](${imageData.url})`
        };

        return {
            id: crypto.randomUUID(), // ID temporal o el que venga del backend
            role: "assistant",
            content: contentPayload,
            model: params.model,
            conversation_id: params.conversation_id || "",
            created_at: new Date().toISOString(),
        };

    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
};