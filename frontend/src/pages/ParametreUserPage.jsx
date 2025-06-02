// frontend/src/components/AccountSettingsComponent.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Pour récupérer l'utilisateur actuel et son token
import '../css/ParametreUserPage.css'; // Styles spécifiques pour ce composant
// import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Pour afficher/cacher le mot de passe

const AccountSettingsComponent = () => {
  const { user, token } = useAuth(); // Supposons que useAuth() renvoie aussi le token
  const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Adaptez

  // Détails du compte
  const [username, setUsername] = useState('');
  // const [email, setEmail] = useState(''); // Si vous voulez permettre la modification de l'email

  // Sécurité - Changement de mot de passe
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [usernameMessage, setUsernameMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  const [isLoadingUsername, setIsLoadingUsername] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  // Pré-remplir les champs avec les informations de l'utilisateur connecté
  useEffect(() => {
    if (user) {
      setUsername(user.nom_utilisateur || '');
      // setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setIsLoadingUsername(true);
    setUsernameMessage({ type: '', text: '' });
    // TODO: Appel API pour mettre à jour le nom d'utilisateur
    // Exemple: PUT /api/user/profile-information (ou une route dédiée)
    // Body: { nom_utilisateur: username }
    // Headers: { Authorization: `Bearer ${token}` }
    console.log("Mise à jour du nom d'utilisateur:", username);
    try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        // if (response.ok) {
        //   setUsernameMessage({ type: 'success', text: 'Nom d\'utilisateur mis à jour avec succès !' });
        //   // Mettre à jour l'objet user dans AuthContext si nécessaire
        // } else {
        //   const errorData = await response.json();
        //   setUsernameMessage({ type: 'error', text: errorData.message || 'Erreur lors de la mise à jour.' });
        // }
        setUsernameMessage({ type: 'success', text: 'Nom d\'utilisateur mis à jour (simulation) !' });
    } catch (error) {
        setUsernameMessage({ type: 'error', text: 'Erreur de connexion.' });
    }
    setIsLoadingUsername(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    if (newPassword !== confirmNewPassword) {
      setPasswordMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' });
      return;
    }
    setIsLoadingPassword(true);
    // TODO: Appel API pour changer le mot de passe
    // Exemple: PUT /api/user/password
    // Body: { current_password: currentPassword, password: newPassword, password_confirmation: confirmNewPassword }
    // Headers: { Authorization: `Bearer ${token}` }
    console.log("Changement de mot de passe pour:", { currentPassword, newPassword });
     try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        // if (response.ok) {
        //   setPasswordMessage({ type: 'success', text: 'Mot de passe changé avec succès !' });
        //   setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
        // } else {
        //   const errorData = await response.json();
        //   setPasswordMessage({ type: 'error', text: errorData.message || 'Erreur lors du changement de mot de passe.' });
        // }
         setPasswordMessage({ type: 'success', text: 'Mot de passe changé (simulation) !' });
         setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
    } catch (error) {
        setPasswordMessage({ type: 'error', text: 'Erreur de connexion.' });
    }
    setIsLoadingPassword(false);
  };

  if (!user) {
    return <p>Chargement des informations du compte...</p>;
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
              />
              <button type="submit" className="btn btn-primary btn-inline" disabled={isLoadingUsername}>
                {isLoadingUsername ? '...' : 'Enregistrer'}
              </button>
            </div>
            {usernameMessage.text && <p className={`message ${usernameMessage.type}`}>{usernameMessage.text}</p>}
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
              type="password" // Ajouter un bouton pour afficher/cacher
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Entrez votre mot de passe actuel"
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
            />
          </div>
          {passwordMessage.text && <p className={`message ${passwordMessage.type}`}>{passwordMessage.text}</p>}
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