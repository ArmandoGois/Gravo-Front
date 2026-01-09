// @/infrastructure/stores/chat-ui.store.ts
import { create } from "zustand";

import type { AIModel } from "@/domain/entities/model.entity";

interface ActiveModel {
    id: string;
    model: AIModel;
    title: string;
}

interface ModelUIState {
    activeModels: ActiveModel[];
    addModel: (model: AIModel) => void;
    removeModel: (tabId: string) => void;
}

export const useModelUIStore = create<ModelUIState>((set) => ({
    activeModels: [],

    addModel: (modelToAddNew) => set((state) => {
        // Check duplicates
        const alreadyExists = state.activeModels.some(
            (item) => item.model.id === modelToAddNew.id
        );

        if (alreadyExists) {
            return state;
        }

        return {
            activeModels: [
                ...state.activeModels,
                {
                    id: crypto.randomUUID(),
                    model: modelToAddNew,
                    title: modelToAddNew.name,
                },
            ],
        };
    }),

    removeModel: (tabId) => set((state) => ({
        activeModels: state.activeModels.filter((item) => item.id !== tabId),
    })),
}));