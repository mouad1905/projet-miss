// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('authToken'));
    const [isLoading, setIsLoading] = useState(true);

    const API_BASE_URL = 'http://127.0.0.1:8000/api';

    // La fonction est maintenant nommée 'fetchUser' et va utiliser le token de l'état
    const fetchUser = useCallback(async () => {
        const currentToken = localStorage.getItem('authToken'); // Toujours vérifier la source de vérité
        if (!currentToken) {
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true); // Indiquer qu'une vérification est en cours
        try {
            const response = await fetch(`${API_BASE_URL}/user`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${currentToken}`,
                },
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                // Token invalide ou expiré
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur:", error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]);

    // Vérification initiale au montage de l'application
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (credentials) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (response.ok && data.access_token && data.user) {
                localStorage.setItem('authToken', data.access_token);
                setToken(data.access_token); // Mettre à jour le token
                setUser(data.user);
                setIsAuthenticated(true);
                return { success: true, user: data.user };
            } else {
                throw new Error(data.message || 'Échec de la connexion.');
            }
        } catch (error) {
            console.error("Erreur de connexion:", error);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        const currentToken = localStorage.getItem('authToken');
        if (currentToken) {
            try {
                await fetch(`${API_BASE_URL}/logout`, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${currentToken}` },
                });
            } catch (error) {
                console.error("Erreur lors de la déconnexion côté serveur:", error);
            }
        }
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    // --- MODIFICATION IMPORTANTE ICI ---
    // On ajoute 'fetchUser' à la valeur fournie par le contexte
    const value = { user, token, isAuthenticated, isLoading, login, logout, fetchUser };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider.');
    }
    return context;
};
