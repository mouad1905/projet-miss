// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Adaptez le chemin

import SidebarAndContent from './component/Sidbar'; // Ou le nom de votre layout principal
import LoginPage from './pages/LoginPage';
// ... autres imports de pages ...

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  // const location = useLocation(); // Pour une redirection plus avancée après connexion

  if (isLoading) {
    return <div>Chargement...</div>; // Ou un composant Spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
    // return <Navigate to="/login" state={{ from: location }} replace />; // Pour rediriger vers la page précédente après connexion
  }
  return children;
};

function App() {
  return (
    // <AuthProvider> {/* AuthProvider englobe tout */}
      <BrowserRouter>
        <AppRoutes /> {/* Composant séparé pour les routes pour utiliser useAuth */}
      </BrowserRouter>
    // </AuthProvider>
  );
}

// Nouveau composant pour pouvoir utiliser useAuth() pour le bouton logout par exemple
function AppRoutes() {
  const { logout } = useAuth(); // Maintenant vous pouvez utiliser useAuth ici

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*" // Capture toutes les autres routes
        element={
          <ProtectedRoute>
            {/* Passez la fonction logout à votre composant de layout principal */}
            <SidebarAndContent onLogout={logout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;