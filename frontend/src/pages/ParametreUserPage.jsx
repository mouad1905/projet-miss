import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { showSuccessToast, showErrorAlert } from '../utils/SwalAlerts';
import '../css/ParametreUserPage.css';
import Loader from '../component/Loader';

const AccountSettingsComponent = () => {
  const { user, token, fetchUser } = useAuth();
  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  const [username, setUsername] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isLoadingUsername, setIsLoadingUsername] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.nom_utilisateur || '');
    }
  }, [user]);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (username === user.nom_utilisateur) {
        showErrorAlert("Le nom d'utilisateur n'a pas changé.");
        return;
    }
    setIsLoadingUsername(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile-information`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nom_utilisateur: username })
      });

      const responseData = await response.json();
      if (!response.ok) {
        const errorMessage = responseData.message || (responseData.errors ? Object.values(responseData.errors).flat().join(' ') : `Erreur HTTP ${response.status}`);
        throw new Error(errorMessage);
      }
      
      showSuccessToast('Nom d\'utilisateur mis à jour avec succès !');
      fetchUser(token);

    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom d'utilisateur:", error);
      showErrorAlert(error.message);
    } finally {
      setIsLoadingUsername(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      showErrorAlert('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    if (newPassword.length < 8) {
      showErrorAlert('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setIsLoadingPassword(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/user/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmNewPassword
        })
      });

      const responseData = await response.json();
      if (!response.ok) {
        const errorMessage = responseData.message || (responseData.errors ? Object.values(responseData.errors).flat().join(' ') : `Erreur HTTP ${response.status}`);
        throw new Error(errorMessage);
      }
      
      showSuccessToast('Mot de passe changé avec succès !');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      showErrorAlert(error.message);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="account-settings-container">
      <div className="settings-section">
        <h3>Détails du compte</h3>
        <form onSubmit={handleUpdateUsername} className="settings-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <div className="input-with-button">
              <span className="input-icon-prefix">@</span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
              />
              <button type="submit" className="btn btn-primary btn-inline" disabled={isLoadingUsername}>
                {isLoadingUsername ? '...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="settings-section">
        <h3>Sécurité</h3>
        <form onSubmit={handleChangePassword} className="settings-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Mot de passe actuel</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Entrez votre mot de passe actuel"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Nouveau mot de passe</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Entrez votre nouveau mot de passe"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirmez votre nouveau mot de passe"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isLoadingPassword}>
              {isLoadingPassword ? 'Modification...' : 'Changer le mot de passe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettingsComponent;