import { httpService } from "@/infrastructure/services/http.service";

export const deleteClientUseCase = async (clientId: string): Promise<void> => {
    await httpService.delete(`/v1/clients/${clientId}`);
};