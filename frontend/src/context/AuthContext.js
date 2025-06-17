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
        const currentToken = localStorage.getItem('authToken');
        if (!currentToken) {
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
            setIsLoading(false); // Le chargement est terminé, il n'y a pas d'utilisateur.
            return;
        }

        // Si on a un token, on le vérifie
        setIsLoading(true);
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
                setToken(currentToken);
                setIsAuthenticated(true);
            } else {
                // Le token est invalide ou a expiré, on nettoie tout
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Erreur réseau lors de la validation du token:", error);
            // En cas d'erreur réseau, on considère l'utilisateur comme déconnecté
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false); // Le processus de vérification est terminé, qu'il ait réussi ou échoué.
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
                // Stockage du token
                localStorage.setItem('authToken', data.access_token);
                localStorage.setItem('authUser', JSON.stringify(data.user)); // Optionnel
                
                // Mise à jour de l'état global
                setToken(data.access_token);
                setUser(data.user);
                setIsAuthenticated(true); // C'est cette mise à jour qui déclenchera la redirection
                
                return { success: true };
            } else {
                throw new Error(data.message || 'Échec de la connexion.');
            }
        } catch (error) {
            console.error("Erreur de connexion:", error);
            // S'assurer de nettoyer en cas d'échec
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        const currentToken = localStorage.getItem('authToken');
        if (currentToken) {
            try {
                // Appeler le backend pour invalider le token côté serveur
                await fetch(`${API_BASE_URL}/logout`, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${currentToken}` },
                });
            } catch (error) {
                console.error("Erreur lors de l'appel de déconnexion au serveur:", error);
            }
        }
        
        // Toujours effectuer la déconnexion côté client
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);

        // Forcer une redirection vers la page de connexion
        window.location.href = '/login';
    };

    // --- MODIFICATION IMPORTANTE ICI ---
    // On ajoute 'fetchUser' à la valeur fournie par le contexte
    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        fetchUser // On exporte aussi fetchUser pour rafraîchir les données si nécessaire
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook personnalisé pour utiliser facilement le contexte d'authentification.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider.');
    }
    return context;
};
