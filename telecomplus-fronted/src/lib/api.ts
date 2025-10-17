import { Contract, Service } from "../types";

const API_BASE_URL = 'http://localhost:8000/api'

type HeadersType = {
    'Content-Type': string;
    'Accept': string;
    'Authorization'?: string;
};

const getToken = (): string | null => {
    if (typeof document === 'undefined') return null;
    
    const nameEQ = "token=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const removeToken = () => {
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    localStorage.removeItem("token"); 
};

async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersType = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    const config: RequestInit = {
        ...options,
        headers: headers as HeadersInit,
    };

    try {
        const response = await fetch(url, config);

        if (response.status === 401) {
            removeToken();
            if (typeof window !== 'undefined') {
                window.location.href = "/login";
            }
            throw new Error("No autorizado");
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return await response.text();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

export const authAPI = {
    register: async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
        return apiFetch("/register", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    login: async (data: { email: string; password: string }) => {
        return apiFetch("/login", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    getMe: async () => {
        return apiFetch('/me');
    },

    logout: async () => {
        return apiFetch("/logout", {
            method: "POST",
        });
    },
};

export const contractAPI = {
    getAll: async () => {
        return apiFetch("/contracts");
    },

    create: async (data: Omit<Contract, "id" | "user_id" | "services">) => {
        return apiFetch("/contract/create", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    getById: async (id: number) => {
        return apiFetch(`/contract/${id}`);
    },
    update: async (id: number, data: Partial<Contract>) => {
        console.log(data)
        return apiFetch(`/contract/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },
    delete: async (id: number) => {
        return apiFetch(`/contract/${id}`, {
            method: "DELETE",
        });
    },
};

export const servicesAPI = {
    getAll: async () => {
        return apiFetch("/services");
    },

    create: async (data: Omit<Service, 'id'>) => {
        console.log(data);
        return apiFetch("/service/create", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    update: async (id: number, data: Partial<Service>) => {
        return apiFetch(`/service/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    delete: async (id: number) => {
        return apiFetch(`/service/${id}`, {
            method: "DELETE",
        });
    },
};
