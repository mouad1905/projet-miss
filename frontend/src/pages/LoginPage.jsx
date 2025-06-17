import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/LoginPage.css';

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
  const [loginField, setLoginField] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/tableau-de-bord';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login({ login: loginField, password });

    setIsSubmitting(false);
    
    if (!result.success) {
      setError(result.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
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
          {error && <p className="login-error-message">{error}</p>}
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="loginField" className="sr-only">Nom d'utilisateur</label>
              <div className="input-group">
                <span className="input-icon"><UserIcon /></span>
                <input
                  type="text"
                  id="loginField"
                  name="loginField"
                  placeholder="Nom d'utilisateur"
                  value={loginField}
                  onChange={(e) => setLoginField(e.target.value)}
                  required
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <button type="submit" className="btn-login" disabled={isSubmitting}>
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;