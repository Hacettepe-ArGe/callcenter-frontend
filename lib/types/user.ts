export interface User {
    email: string;
    role: 'admin' | 'user';
    companyName?: string;
    companySize?: string;
    companyType?: string;
    industry?: string;
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
} 