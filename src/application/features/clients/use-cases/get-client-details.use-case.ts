import { GetClientDetailsResponseDto } from "@/domain/dtos/client-response.dto";
import type { ClientDetails } from "@/domain/entities/client.entity";
import { httpService } from "@/infrastructure/services/http.service";

export const getClientDetailsUseCase = async (clientId: string): Promise<ClientDetails | null> => {
    try {
        const response = await httpService.get<GetClientDetailsResponseDto>(
            `/v1/clients/${clientId}`
        );

        return response;

    } catch (error) {
        console.error(`Error fetching client details for ${clientId}:`, error);
        return null;
    }
};