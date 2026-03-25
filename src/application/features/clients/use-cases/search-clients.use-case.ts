import { SearchClientsResponseDto } from "@/domain/dtos/client-search.dto";
import { httpService } from "@/infrastructure/services/http.service";

export const searchClientsUseCase = async (query: string): Promise<SearchClientsResponseDto> => await httpService.get<SearchClientsResponseDto>(`/v1/clients/search?q=${query}&limit=5`);