import { Client } from "@/domain/entities/client.entity";

export interface GetClientsResponseDto {
    clients: Client[];
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
}