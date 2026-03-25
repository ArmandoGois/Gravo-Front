import { GetClientsResponseDto } from "@/domain/dtos/client-response.dto";
import type { Client } from "@/domain/entities/client.entity";
import { httpService } from "@/infrastructure/services/http.service";

export const getClientsUseCase = async (): Promise<Client[]> => {
    try {
        const response = await httpService.get<GetClientsResponseDto>(
            `/v1/clients?limit=50&offset=0&active_only=true`
        );

        // Return the array of clients from the DTO
        return response.clients || [];

    } catch (error) {
        console.error("Error fetching clients:", error);
        return [];
    }
};