import type { GenerateImageRequestDto, GenerateImageResponseDto } from "@/domain/dtos/image-generation.dto";
import type { Message } from "@/domain/entities/message.entity";
import { httpService } from "@/infrastructure/services/http.service";

const base64ToBlob = (base64: string): Blob => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
};

export const generateImageVariationUseCase = async (
    params: GenerateImageRequestDto
): Promise<Message> => {
    try {
        const formData = new FormData();

        formData.append("model", params.model);
        formData.append("prompt", params.prompt);
        formData.append("n", String(params.n ?? 1));
        formData.append("size", params.size ?? "2K");
        formData.append("aspect_ratio", params.aspect_ratio ?? "1:1");

        if (params.conversation_id) {
            formData.append("conversation_id", params.conversation_id);
        }

        params.reference_images?.forEach((item, index) => {
            if (item instanceof File) {
                formData.append("reference_images", item);
            } else if (typeof item === 'string') {
                const blob = base64ToBlob(item);
                formData.append("reference_images", blob, `image_${index}.png`);
            }
        });

        // Endpoint Upload
        const response = await httpService.post<GenerateImageResponseDto>(
            "/v1/images/generations/upload",
            formData,
            {
                headers: {
                    "Content-Type": undefined as unknown as string
                }
            }
        );

        console.log("generateImageVariationUseCase loaded");

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
        console.error("Error generating image variation:", error);
        throw error;
    }
};