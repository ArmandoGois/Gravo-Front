export interface ClientSuggestion {
    id: string;
    type: string;
    name: string;
    slug: string;
    logo_url: string;
    industry: string;
}

export interface SearchClientsResponseDto {
    suggestions: ClientSuggestion[];
    query: string;
}