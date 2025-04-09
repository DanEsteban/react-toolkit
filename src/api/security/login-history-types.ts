export interface CreateLoginHistory {
     userId: number;
     userName: string;
}

export type LoginHistoryItem = {
     id: number;
     ip: string;
     browser: string;
     os: string;
     timestamp: string;
     location: string;
     deviceType: string;
     userName: string;
};

