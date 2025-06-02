// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('authToken')); // Lire depuis localStorage au démarrage
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('authToken'));
    const [isLoading, setIsLoading] = useState(true); // Pour gérer le chargement initial de l'état d'authentification

    const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Adaptez si votre backend est ailleurs

    const fetchUser = useCallback(async (currentToken) => {
        if (currentToken) {
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
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur:", error);
                localStorage.removeItem('authToken');
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
            }
        }
        setIsLoading(false); // Fin du chargement de l'état d'authentification initial
    }, [API_BASE_URL]); // API_BASE_URL ne devrait pas changer, mais bonne pratique de le lister si utilisé

    // Vérifier l'authentification au montage du composant
    useEffect(() => {
        const initialToken = localStorage.getItem('authToken');
        if (initialToken) {
            setToken(initialToken); // S'assurer que l'état du token est synchronisé
            fetchUser(initialToken);
        } else {
            setIsLoading(false); // Pas de token, pas besoin de charger l'utilisateur
        }
    }, [fetchUser]);


    const login = async (credentials) => { // credentials = { login: 'usernameOrEmail', password: 'password' }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (response.ok && data.access_token && data.user) {
                localStorage.setItem('authToken', data.access_token);
                localStorage.setItem('authUser', JSON.stringify(data.user)); // Optionnel: stocker l'utilisateur aussi
                setToken(data.access_token);
                setUser(data.user);
                setIsAuthenticated(true);
                setIsLoading(false);
                return { success: true, user: data.user };
            } else {
                throw new Error(data.message || 'Échec de la connexion. Vérifiez la réponse du serveur.');
            }
        } catch (error) {
            console.error("Erreur de connexion:", error);
            setIsLoading(false);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        const currentToken = localStorage.getItem('authToken'); // Utiliser le token stocké pour la requête de déconnexion
        if (currentToken) {
            try {
                await fetch(`${API_BASE_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${currentToken}`,
                    },
                });
            } catch (error) {
                console.error("Erreur lors de la déconnexion côté serveur (sera ignorée côté client):", error);
            }
        }
        // Toujours effectuer la déconnexion côté client
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser'); // Nettoyer aussi les infos utilisateur stockées
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    // La fonction register pourrait être ajoutée ici de manière similaire à login
    // const register = async (userData) => { ... };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout /*, register */ }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};