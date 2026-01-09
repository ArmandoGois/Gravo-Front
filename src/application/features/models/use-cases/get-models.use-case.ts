import type { AIModel } from "@/domain/entities/model.entity";
import { httpService } from "@/infrastructure/services/http.service";

export const getModelsUseCase = async (): Promise<AIModel[]> => {
    try {
        const models = await httpService.get<AIModel[]>("/v1/models");

        return models;

    } catch (error) {
        console.error("Error fetching models:", error);
        return [];
    }
};