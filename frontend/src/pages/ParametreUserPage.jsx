// frontend/src/components/AccountSettingsComponent.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Pour récupérer l'utilisateur actuel et son token
import { showSuccessToast, showErrorAlert } from '../utils/SwalAlerts'; // Pour de belles notifications
import '../css/ParametreUserPage.css'; // Styles spécifiques pour ce composant
import Loader from '../component/Loader';

const AccountSettingsComponent = () => {
  const { user, token, fetchUser } = useAuth(); // Récupérer la fonction pour rafraîchir les données utilisateur
  const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Adaptez si nécessaire

  // Détails du compte
  const [username, setUsername] = useState('');

  // Sécurité - Changement de mot de passe
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isLoadingUsername, setIsLoadingUsername] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  // Pré-remplir le champ avec les informations de l'utilisateur connecté
  useEffect(() => {
    if (user) {
      setUsername(user.nom_utilisateur || '');
    }
  }, [user]);

  // Fonction pour mettre à jour le nom d'utilisateur
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
      fetchUser(token); // Rafraîchit les données utilisateur dans le contexte global

    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom d'utilisateur:", error);
      showErrorAlert(error.message);
    } finally {
      setIsLoadingUsername(false);
    }
  };

  // Fonction pour changer le mot de passe
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
      // Vider les champs après succès
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
      {/* Section Détails du compte */}
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

      {/* Section Sécurité */}
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
