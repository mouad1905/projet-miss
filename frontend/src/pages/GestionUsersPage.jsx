// frontend/src/pages/UserManagementPage.jsx
import React, { useState } from 'react';
import AccountSettingsComponent from './ParametreUserPage'; // À créer
import AddUserPageComponent from './AjouterUserPage'; // Celui que nous avons pour l'ajout
import '../css/ConsommableList.css'; // Vos styles partagés
import '../css/GestionUserPage.css'; // Styles spécifiques pour cette page

const UserManagementPage = () => {
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' ou 'addUser'

  return (
    <div className="data-table-view user-management-page"> {/* Utilisation de classes existantes + spécifiques */}
      <header className="content-header">
        {/* Le titre pourrait changer en fonction de l'onglet actif */}
        <h1>{activeTab === 'settings' ? 'Paramètres du compte' : 'Ajouter un utilisateur'}</h1>
        {/* Pas de bouton "Ajouter" global ici, car chaque section a ses propres actions */}
      </header>

      <div className="user-management-tabs">
        <button
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Paramètres du compte
        </button>
        <button
          className={`tab-button ${activeTab === 'addUser' ? 'active' : ''}`}
          onClick={() => setActiveTab('addUser')}
        >
          Ajouter un utilisateur
        </button>
        {/* Vous pourriez cacher "Ajouter un utilisateur" si l'utilisateur actuel n'est pas admin */}
      </div>

      <div className="user-management-content">
        {activeTab === 'settings' && <AccountSettingsComponent />}
        {activeTab === 'addUser' && <AddUserPageComponent />}
      </div>
    </div>
  );
};

export default UserManagementPage;