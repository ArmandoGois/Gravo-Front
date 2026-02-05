import { create } from 'zustand';

import { ImageHistoryItemDto } from '@/domain/dtos/image-history.dto';

interface ImageUIStore {
    imageHistory: ImageHistoryItemDto[];
    setImageHistory: (history: ImageHistoryItemDto[]) => void;
}

export const useImageUIStore = create<ImageUIStore>((set) => ({
    imageHistory: [],
    setImageHistory: (history) => set({ imageHistory: history }),
}));