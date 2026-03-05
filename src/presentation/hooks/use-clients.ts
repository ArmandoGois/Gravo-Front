import { useState, useCallback } from 'react';

import { getClientsUseCase } from '@/application/features/clients/use-cases/get-clients.use-case';
import { Client } from '@/domain/entities/client.entity';


export const useClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadClients = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getClientsUseCase();
            setClients(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred fetching clients');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        clients,
        isLoading,
        error,
        loadClients
    };
};