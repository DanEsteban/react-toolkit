export interface Account {
    id?: number; 
    code: string;
    name: string;
    level: number;
    parent_code?: string;
}