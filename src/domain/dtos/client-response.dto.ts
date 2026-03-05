import { Client, ClientDetails } from "@/domain/entities/client.entity";

export interface GetClientsResponseDto {
    clients: Client[];
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
}

// Added new DTO for single client response
export type GetClientDetailsResponseDto = ClientDetails;