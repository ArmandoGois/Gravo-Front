import { useQuery } from "@tanstack/react-query";

import { getModelsUseCase } from "@/application/features/models/use-cases/get-models.use-case";

export const useModels = () => {
    const {
        data: models,
        isLoading,
        isError
    } = useQuery({
        queryKey: ["models"],
        queryFn: getModelsUseCase,

        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

    return {
        models: models || [],
        isLoading,
        isError
    };
};