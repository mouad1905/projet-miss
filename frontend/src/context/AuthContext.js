import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null); // Initialisé à null, useEffect s'en chargera
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // True initialement

    const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Adaptez

    // Fonction pour valider un token et récupérer les infos utilisateur
    const validateTokenAndFetchUser = useCallback(async (currentToken) => {
        if (!currentToken) {
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setIsLoading(false);
            return;
        }

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
                setToken(currentToken); // S'assurer que le token est dans l'état
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Erreur lors de la validation du token:", error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]);

    // Vérifier l'authentification au montage initial
    useEffect(() => {
        const initialToken = localStorage.getItem('authToken');
        validateTokenAndFetchUser(initialToken);
    }, [validateTokenAndFetchUser]); // validateTokenAndFetchUser est stable grâce à useCallback

    const login = async (credentials) => {
        // setIsLoading(true); // Optionnel, car la page de login peut avoir son propre indicateur
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
                localStorage.setItem('authUser', JSON.stringify(data.user)); // Optionnel
                setToken(data.access_token);
                setUser(data.user);
                setIsAuthenticated(true); // État mis à jour
                setIsLoading(false);      // Le chargement est terminé, l'état est connu
                return { success: true, user: data.user };
            } else {
                throw new Error(data.message || 'Échec de la connexion.');
            }
        } catch (error) {
            console.error("Erreur de connexion:", error);
            setIsAuthenticated(false); // S'assurer de l'état non authentifié
            setUser(null);
            setToken(null);
            setIsLoading(false); // Le chargement est terminé, même en cas d'erreur
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        const currentToken = localStorage.getItem('authToken');
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
                console.error("Erreur lors de la déconnexion côté serveur:", error);
            }
        }
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        // setIsLoading(false); // Pas critique ici, mais peut être ajouté pour la cohérence
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) { // La valeur initiale du contexte est null
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider.');
    }
    return context;
};
