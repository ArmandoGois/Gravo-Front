import { EditImageRequestDto, EditImageResponseDto } from "@/domain/dtos/edit-image.dto";
import { httpService } from "@/infrastructure/services/http.service";

export const editImageUseCase = async (payload: EditImageRequestDto): Promise<EditImageResponseDto> => {
    try {
        const body: EditImageRequestDto = {
            ...payload,
            operation: payload.operation ?? "remove_background", // Default operation
            scale: payload.scale ?? 2,
            mode: payload.mode ?? "creative",
            output_resolution: payload.output_resolution ?? "full",
            style: payload.style ?? "standard",
            light_transfer_strength: payload.light_transfer_strength ?? 100,
            change_background: payload.change_background ?? true,
            preserve_details: payload.preserve_details ?? true,
            direction: payload.direction ?? "all",
            expand_ratio: payload.expand_ratio ?? 1.5,
            aspect_ratio: payload.aspect_ratio ?? "square_1_1"
        };

        const response = await httpService.post<EditImageResponseDto>(
            '/v1/images/edits',
            body
        );

        return response;
    } catch (error) {
        console.error("Error editing image:", error);
        throw error;
    }
};