// @/infrastructure/stores/model-ui.store.ts
import { create } from "zustand";

import type { AIModel } from "@/domain/entities/model.entity";

// Simplificamos: ActiveModel usa el mismo ID que el modelo real
interface ActiveModel {
    id: string;        // Ahora esto será igual a model.id
    model: AIModel;
    title: string;
}

interface ModelUIState {
    activeModels: ActiveModel[];
    addModel: (model: AIModel) => void;
    removeModel: (modelId: string) => void;
    setModels: (models: AIModel[]) => void;
}

export const useModelUIStore = create<ModelUIState>((set) => ({
    activeModels: [],

    addModel: (modelToAddNew) => set((state) => {
        const alreadyExists = state.activeModels.some(
            (item) => item.id === modelToAddNew.id
        );

        if (alreadyExists) {
            return state;
        }

        return {
            activeModels: [
                ...state.activeModels,
                {
                    id: modelToAddNew.id,
                    model: modelToAddNew,
                    title: modelToAddNew.name,
                },
            ],
        };
    }),

    removeModel: (modelId) => set((state) => ({
        activeModels: state.activeModels.filter((item) => item.id !== modelId),
    })),


    setModels: (models) => set(() => {
        const newActiveModels: ActiveModel[] = models.map(aiModel => ({
            id: aiModel.id,
            model: aiModel,
            title: aiModel.name
        }));

        return { activeModels: newActiveModels };
    }),
}));