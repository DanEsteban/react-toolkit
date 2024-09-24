import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../http";
import { Account, CreateAccountData, UpdateAccountData } from "./account.types";


export const AccountApiService = {
    getAccountTree: async (): Promise<Account[]> => {
        const response = await http.get('accounts');
        return response.data;
    },

    getAccountById: async (id: number): Promise<Account> => {
        const response = await http.get(`accounts/${id}`);
        return response.data;
    },

    createAccount: async (data: CreateAccountData): Promise<Account> => {
        const response = await http.post('accounts', data);
        return response.data;
    },

    updateAccount: async (id: number, data: UpdateAccountData): Promise<Account> => {
        const response = await http.put(`accounts/${id}`, data);
        return response.data;
    },

    deleteAccount: async (id: number): Promise<boolean> => {
        const response = await http.delete(`/accounts/${id}`);
        return response.data;
    },
};

// **Hooks de React Query**

// Obtener el árbol completo de cuentas
export const useAccountTree = () => {
    return useQuery<Account[], Error>('accountTree', AccountApiService.getAccountTree);
};

// Obtener una cuenta específica por ID
export const useAccountById = (id: number) => {
    return useQuery<Account, Error>(['account', id], () => AccountApiService.getAccountById(id));
};

// Crear una nueva cuenta
export const useCreateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation(AccountApiService.createAccount, {
        onSuccess: () => {
            // Invalida y refetch la lista de cuentas para obtener los datos actualizados
            queryClient.invalidateQueries('accountTree');
        },
    });
};

// Actualizar una cuenta existente
export const useUpdateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ id, data }: { id: number; data: UpdateAccountData }) =>
            AccountApiService.updateAccount(id, data),
        {
            onSuccess: () => {
                // Invalida y refetch la lista de cuentas
                queryClient.invalidateQueries('accountTree');
            },
        }
    );
};

// Eliminar una cuenta
export const useDeleteAccount = () => {
    const queryClient = useQueryClient();
    return useMutation((id: number) => AccountApiService.deleteAccount(id), {
        onSuccess: () => {
            // Invalida y refetch la lista de cuentas
            queryClient.invalidateQueries('accountTree');
        },
    });
};