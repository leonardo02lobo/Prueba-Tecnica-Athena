export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    contracts?: Contract[];
}

export interface Contract {
    id: number;
    user_id: number;
    contract_number: string;
    start_date: string;
    status: 'active' | 'suspended' | 'cancelled';
    services?: Service[];
}

export interface Service {
    id: number;
    contract_id: number;
    type: 'internet' | 'tv';
    plan_name: string;
    price: number;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User
}