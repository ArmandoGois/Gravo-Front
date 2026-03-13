import { CreateClientRequestDto } from "@/domain/dtos/create-client.dto";
import type { Client } from "@/domain/entities/client.entity";
import { httpService } from "@/infrastructure/services/http.service";

export const createClientUseCase = async (data: CreateClientRequestDto): Promise<Client> =>
    // Post to /v1/clients and expect a Client object back
    await httpService.post<Client>('/v1/clients', data)
    ;