export interface User {
    id: string;
    email: string;
    name?: string;
    token?: string;
    companyId?: string;
    companyName?: string;
    points?: number;
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
} 