import { CreateBrandProfileRequestDto } from "@/domain/dtos/create-brand.dto";
import { httpService } from "@/infrastructure/services/http.service";

export const createBrandProfileUseCase = async (clientId: string, data: CreateBrandProfileRequestDto): Promise<void> =>
    // Post to /v1/clients/{client_id}/brand
    await httpService.put<void>(`/v1/clients/${clientId}/brand`, data);
;