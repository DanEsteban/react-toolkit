export interface Account {
    id: number;
    name: string;
    code: string;
    children?: Account[];
}

export interface CreateAccountData {
name: string;
code: string;
parentId?: number;
}

export interface UpdateAccountData {
name?: string;
code?: string;
}