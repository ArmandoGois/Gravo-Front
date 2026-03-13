import { useState, useCallback } from 'react';

import { deleteClientUseCase } from '@/application/features/clients/use-cases/delete-client.use-case';
import { getClientDetailsUseCase } from '@/application/features/clients/use-cases/get-client-details.use-case';
import { getClientsUseCase } from '@/application/features/clients/use-cases/get-clients.use-case';
import type { Client, ClientDetails } from '@/domain/entities/client.entity';


export const useClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // New states for the detail view
    const [selectedClientDetails, setSelectedClientDetails] = useState<ClientDetails | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    // State for deletion
    const [isDeleting, setIsDeleting] = useState(false);

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

    const clearSelectedClient = useCallback(() => {
        setSelectedClientDetails(null);
    }, []);

    // Nueva función para eliminar
    const deleteClient = useCallback(async (clientId: string) => {
        setIsDeleting(true);
        try {
            await deleteClientUseCase(clientId);
            // Limpiar la selección y recargar la lista si tiene éxito
            clearSelectedClient();
            await loadClients();
        } catch (error) {
            console.error("Error deleting client:", error);
            throw error;
        } finally {
            setIsDeleting(false);
        }
    }, [clearSelectedClient, loadClients]);

    return {
        clients,
        isLoading,
        loadClients,
        selectedClientDetails,
        isLoadingDetails,
        loadClientDetails,
        clearSelectedClient,
        deleteClient,
        isDeleting
    };
};