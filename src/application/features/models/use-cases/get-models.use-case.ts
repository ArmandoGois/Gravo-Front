import type { Model } from "@/domain/entities/model.entity";
import { httpService } from "@/infrastructure/services/http.service";

export const getModelsUseCase = async (): Promise<Model[]> => {
    try {
        const models = await httpService.get<Model[]>("/v1/models");

        return models;

    } catch (error) {
        console.error("Error fetching models:", error);
        return [];
    }
};