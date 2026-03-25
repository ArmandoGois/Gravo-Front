import { useState } from 'react';

import { createBrandProfileUseCase } from '@/application/features/clients/use-cases/create-brand.use-case';
import { createClientUseCase } from '@/application/features/clients/use-cases/create-client.use-case';
import { updateClientUseCase } from '@/application/features/clients/use-cases/update-client.use-case';
import { CreateBrandProfileRequestDto } from '@/domain/dtos/create-brand.dto';
import { CreateClientRequestDto } from '@/domain/dtos/create-client.dto';
import { UpdateClientRequestDto } from '@/domain/dtos/update-client.dto';


export const useCreateClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createClient = async (data: CreateClientRequestDto) => {
        setIsLoading(true);
        setError(null);
        try {
            return await createClientUseCase(data);
        } catch (err: any) {
            setError(err.message || 'Failed to create client');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Update function uses the new DTO
    const updateClient = async (clientId: string, data: UpdateClientRequestDto) => {
        setIsLoading(true);
        setError(null);
        try {
            return await updateClientUseCase(clientId, data);
        } catch (err: any) {
            setError(err.message || 'Failed to update client');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const createBrandProfile = async (clientId: string, data: CreateBrandProfileRequestDto) => {
        setIsLoading(true);
        setError(null);
        try {
            await createBrandProfileUseCase(clientId, data);
        } catch (err: any) {
            setError(err.message || 'Failed to create/update brand profile');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createClient, updateClient, createBrandProfile, isLoading, error };
};