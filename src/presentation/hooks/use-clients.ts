import { useState, useCallback } from 'react';

import { getClientDetailsUseCase } from '@/application/features/clients/use-cases/get-client-details.use-case';
import { getClientsUseCase } from '@/application/features/clients/use-cases/get-clients.use-case';
import type { Client, ClientDetails } from '@/domain/entities/client.entity';


export const useClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // New states for the detail view
    const [selectedClientDetails, setSelectedClientDetails] = useState<ClientDetails | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const loadClients = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getClientsUseCase();
            setClients(data);
        } catch (error) {
            console.error("Error in useClients hook:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // New function to load specific client
    const loadClientDetails = useCallback(async (clientId: string) => {
        setIsLoadingDetails(true);
        setSelectedClientDetails(null); // Clear previous data while loading
        try {
            const data = await getClientDetailsUseCase(clientId);
            setSelectedClientDetails(data);
        } catch (error) {
            console.error("Error loading client details:", error);
        } finally {
            setIsLoadingDetails(false);
        }
    }, []);

    // Helper to clear selection and go back to grid
    const clearSelectedClient = useCallback(() => {
        setSelectedClientDetails(null);
    }, []);

    return {
        clients,
        isLoading,
        loadClients,

        // Exposed new states and functions
        selectedClientDetails,
        isLoadingDetails,
        loadClientDetails,
        clearSelectedClient
    };
};