import { GetImageGenerationDetailsResponseDto } from "@/domain/dtos/image-generation-details.dto";
import { httpService } from "@/infrastructure/services/http.service";

export const getImageGenerationDetailsUseCase = async (generationId: string): Promise<GetImageGenerationDetailsResponseDto> => {
    try {
        const response = await httpService.get<GetImageGenerationDetailsResponseDto>(
            `/v1/images/generations/${generationId}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching image details:", error);
        throw error;
    }
};