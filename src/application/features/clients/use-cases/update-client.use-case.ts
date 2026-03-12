import { UpdateClientRequestDto } from "@/domain/dtos/update-client.dto";
import type { Client } from "@/domain/entities/client.entity";
import { httpService } from "@/infrastructure/services/http.service";

export const updateClientUseCase = async (clientId: string, data: UpdateClientRequestDto): Promise<Client> => await httpService.put<Client>(`/v1/clients/${clientId}`, data);