const API_URL = 'http://localhost:8000/api';

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface UserProfile {
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    profile?: UserProfile;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export const authService = {
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(Object.values(error).flat().join(' '));
        }

        return response.json();
    },

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(Object.values(error).flat().join(' '));
        }

        return response.json();
    },

    async getProfile(token: string): Promise<User> {
        const response = await fetch(`${API_URL}/auth/profile/`, {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        return response.json();
    },

    async updateProfileAddress(token: string, address: Partial<UserProfile>): Promise<UserProfile> {
        const response = await fetch(`${API_URL}/auth/profile/address/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(address),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || 'Failed to update address');
        }

        return response.json();
    },
};
