import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'admin' | 'operator' | 'researcher';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    empId?: number;
}

const MOCK_USERS: User[] = [
    { id: '1', name: 'Dr. Admin', role: 'admin' },
    { id: '2', name: 'Operator Jane', role: 'operator' },
    { id: '3', name: 'Dr. Alice Smith', role: 'researcher', empId: 101 },
    { id: '4', name: 'Dr. Bob Chen', role: 'researcher', empId: 102 },
    { id: '5', name: 'Dr. Carol Davis', role: 'researcher', empId: 103 },
];

interface AuthContextType {
    user: User | null;
    login: (userId: string) => void;
    logout: () => void;
    users: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'spms_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage on first render
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    const login = (userId: string) => {
        const found = MOCK_USERS.find(u => u.id === userId);
        if (found) {
            setUser(found);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, users: MOCK_USERS }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};