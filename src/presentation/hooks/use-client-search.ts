import { useState, useEffect } from 'react';

import { searchClientsUseCase } from '@/application/features/clients/use-cases/search-clients.use-case';
import type { ClientSuggestion } from '@/domain/dtos/client-search.dto';

export const useClientSearch = (query: string, showMentions: boolean) => {
    const [suggestions, setSuggestions] = useState<ClientSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!showMentions || query.length < 1) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(async () => {
            try {
                const data = await searchClientsUseCase(query);
                setSuggestions(data.suggestions || []);
            } catch (error) {
                console.error("Error searching clients:", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query, showMentions]);

    return { suggestions, isLoading };
};