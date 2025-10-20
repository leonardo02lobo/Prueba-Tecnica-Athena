import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task';

const API_BASE_URL = 'http://localhost:8080/api/task';

export const taskApi = {
    getAllTasks: async (): Promise<Task[]> => {
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token()}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    },

    getTaskById: async (taskId: number): Promise<Task> => {
        const response = await fetch(`${API_BASE_URL}/${taskId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token()}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    },

    createTask: async (taskData: CreateTaskRequest): Promise<any> => {
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token()}`
            },
            credentials: 'include',
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return response.text();
    },

    updateTask: async (taskId: number, taskData: UpdateTaskRequest): Promise<any> => {
        const response = await fetch(`${API_BASE_URL}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token()}`
            },
            credentials: 'include',
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return response.text();
    },

    updateTaskStatus: async (taskId: number, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'): Promise<any> => {
        try {
            const currentTask = await taskApi.getTaskById(taskId);
            console.log('Tarea actual:', currentTask);

            const updateData: UpdateTaskRequest = {
                title: currentTask.title,
                description: currentTask.description,
                status: status,
                user_Id: currentTask.user_Id
            };

            return taskApi.updateTask(taskId, updateData);
        } catch (error) {
            console.error('Error obteniendo tarea para actualizar:', error);
            throw error;
        }
    },

    deleteTask: async (taskId: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token()}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
    }
};

const token = () => {
    const stored = localStorage.getItem("data");
    let data
    try {
        data = stored ? JSON.parse(stored) : null
    } catch (error) {
        console.error('Error parsing localStorage data:', error);
        console.log('Raw stored value:', stored);
    }
    return data.token
}