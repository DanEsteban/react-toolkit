import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";
import http from "../http";
import { Account, } from "./account-types";

const fetchAccountsRequest = async (offset: number, take: number) => {
    const response = await http.get(`/accounts?offset=${offset}&take=${take}`);
    return response.data;
};


const addAccountRequest = (newAccount: Partial<Account>) => {
    return http.post('/accounts', newAccount);
};


const updateAccountRequest = (id: string, updatedAccount: Partial<Account>) => {
    return http.put(`/accounts/${id}`, updatedAccount);
};

const deleteAccountRequest = (id: string) => {
    return http.delete(`/accounts/${id}`);
};

//* Hooks

// Obtener todas las cuentas
export const useAccounts = (offset: number, take: number) => {
    return useQuery<Account[]>({
        queryKey: ['accounts'],
        queryFn: () => fetchAccountsRequest(offset, take),
        onError: (error) => {
            console.error('Error al obtener las cuentas:', error);
        }
    });
};

// Agregar una nueva cuenta
export const useAddAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['addAccount'],
        mutationFn: addAccountRequest,
        onSuccess: () => {
            queryClient.invalidateQueries(['accounts']);
        },
        onError: (error) => {
            console.error('Error al agregar una nueva cuenta:', error);
        }
    });
};

export const useUpdateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['updateAccount'],
        mutationFn: ({ id, updatedAccount }: { id: string; updatedAccount: Partial<Account> }) => updateAccountRequest(id, updatedAccount),
        onSuccess: () => {
            queryClient.invalidateQueries(['accounts']);
        },
        onError: (error) => {
            console.error('Error al actualizar la cuenta:', error);
        },
    });
};

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['deleteAccount'],
        mutationFn: (id: string) => deleteAccountRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['accounts']);
        },
        onError: (error) => {
            console.error('Error al eliminar la cuenta:', error);
        },
    });
};