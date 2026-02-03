import type { GenerateImageRequestDto, GenerateImageResponseDto } from "@/domain/dtos/image-generation.dto";
import type { Message } from "@/domain/entities/message.entity";
import { httpService } from "@/infrastructure/services/http.service";


export const generateImageUseCase = async (
    params: GenerateImageRequestDto
): Promise<Message> => {
    try {
        const payload = {
            model: params.model,
            prompt: params.prompt,
            n: params.n ?? 1,
            size: params.size ?? "2K",
            aspect_ratio: params.aspect_ratio ?? "1:1",
            conversation_id: params.conversation_id
        };

        // Endpoint JSON original
        const response = await httpService.post<GenerateImageResponseDto>("/v1/images/generations", payload);

        const imageData = response.data?.[0];
        if (!imageData || !imageData.url) throw new Error("No image URL received");

        return {
            id: crypto.randomUUID(),
            role: "assistant",
            content: { type: "image", text: imageData.url },
            model: params.model,
            conversation_id: params.conversation_id || "",
            created_at: new Date().toISOString(),
        };
    } catch (error) {
        console.error("Error generating image from text:", error);
        throw error;
    }
};