import { GetImageHistoryResponseDto } from "@/domain/dtos/image-history.dto";
import { httpService } from "@/infrastructure/services/http.service";

export const getImageHistoryUseCase = async (limit = 20, offset = 0): Promise<GetImageHistoryResponseDto> => {
    try {
        const response = await httpService.get<GetImageHistoryResponseDto>(
            `/v1/images/generations?limit=${limit}&offset=${offset}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching image history:", error);
        throw error;
    }
};