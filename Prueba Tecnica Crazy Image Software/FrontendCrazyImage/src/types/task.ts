export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    user_Id: number;
    user?: User;
}

export interface User {
    id?: number;
    email?: string;
    username?: string;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    user_Id: number;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    user_Id?: number;
}