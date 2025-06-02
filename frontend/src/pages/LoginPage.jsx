// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css'; // Assurez-vous d'avoir ce fichier avec les styles de la page de connexion

// Icônes SVG en ligne (ou importez depuis react-icons si vous préférez)
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
  </svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
  </svg>
);

const LoginPage = () => {
  const [loginField, setLoginField] = useState(''); // Peut être nom_utilisateur ou email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Adaptez si votre backend est ailleurs

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ login: loginField, password: password }),
      });

      const data = await response.json(); // Toujours essayer de parser la réponse

      if (response.ok) {
        // Connexion réussie, Laravel devrait renvoyer un token et les infos utilisateur
        console.log('Login successful:', data);
        if (data.access_token && data.user) {
          localStorage.setItem('authToken', data.access_token);
          localStorage.setItem('authUser', JSON.stringify(data.user)); // Stocker les infos utilisateur
          
          // Rediriger vers le tableau de bord ou la page principale de l'application
          navigate('/tableau-de-bord'); // Ou la route de votre choix
        } else {
          // La réponse est OK mais ne contient pas les données attendues
          setError('Réponse de connexion invalide du serveur.');
        }
      } else {
        // Échec de la connexion (erreur 4xx ou 5xx)
        setError(data.message || `Erreur ${response.status}: Échec de la connexion.`);
      }
    } catch (err) {
      // Erreur réseau ou problème de parsing JSON si la réponse n'est pas du tout du JSON
      console.error("Erreur de connexion (catch):", err);
      setError('Une erreur réseau est survenue ou la réponse du serveur est invalide.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-branding">
        <img src="/images/bg_1.png" alt="Logo Municipalité Berkane" className="logo"/>
      </div>
      <div className="login-form-area">
        <div className="login-form-wrapper">
          <h2>Bienvenue!</h2>
          <p className="subtitle">Veuillez saisir vos informations</p>
          {error && <p className="login-error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="loginField" className="sr-only">Nom d'utilisateur ou Email</label>
              <div className="input-group">
                <span className="input-icon"><UserIcon /></span>
                <input
                  type="text"
                  id="loginField"
                  name="loginField"
                  placeholder="Nom d'utilisateur ou Email"
                  value={loginField}
                  onChange={(e) => setLoginField(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <div className="input-group">
                <span className="input-icon"><LockIcon /></span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
            <div className="forgot-password-link">
              <a href="#">Mot de passe oublié?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;