import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getImageHistoryUseCase } from "@/application/features/image/use-cases/get-image-history.use-case";
import { useImageUIStore } from "@/infrastructure/stores/image-ui.store";

export const useImageHistory = () => {
    const { imageHistory, setImageHistory } = useImageUIStore();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['image-history'],
        queryFn: () => getImageHistoryUseCase(20, 0), // Default limit 20, offset 0
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (data?.data) {
            setImageHistory(data.data);
        }
    }, [data, setImageHistory]);

    return {
        imageHistory,
        isLoading,
        error,
        refetch
    };
};