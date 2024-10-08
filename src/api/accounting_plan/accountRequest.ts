import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../http";
import { Account, } from "./account.types";

const fetchAccountsRequest = async () => {
    const response = await http.get('/accounts');
    return response.data;
};


const addAccountRequest = (newAccount: Partial<Account>) => {
    return http.post('/accounts', newAccount);
};


const updateAccountRequest = (id: string, updatedAccount: Partial<Account>) => {
    return http.put(`/accounts/${id}`, updatedAccount);
};

//* Hooks

// Obtener todas las cuentas
export const useAccounts = () => {
    return useQuery<Account[]>({
        queryKey: ['accounts'],
        queryFn: fetchAccountsRequest,
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