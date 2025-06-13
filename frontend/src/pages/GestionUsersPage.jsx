// src/pages/UserManagementPage.jsx
import React, { useState } from 'react';
import AccountSettingsComponent from './ParametreUserPage'; // À créer
import AddUserPageComponent from './AjouterUserPage';
import UserListComponent from './UserList'; // Celui que nous avons pour l'ajout
import '../css/ConsommableList.css'; // Vos styles partagés
import '../css/GestionUserPage.css'; // CSS pour les onglets

const UserManagementPage = () => {
  // 'list' devient l'onglet par défaut
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="data-table-view user-management-page">
      <header className="content-header">
        <h1>Gestion des utilisateurs</h1>
      </header>

      <div className="user-management-tabs">
        <button
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Liste des utilisateurs
        </button>
        <button
          className={`tab-button ${activeTab === 'addUser' ? 'active' : ''}`}
          onClick={() => setActiveTab('addUser')}
        >
          Ajouter un utilisateur
        </button>
        <button
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Mes Paramètres
        </button>
      </div>

      <div className="user-management-content">
        {activeTab === 'list' && <UserListComponent />}
        {activeTab === 'addUser' && <AddUserPageComponent />}
        {activeTab === 'settings' && <AccountSettingsComponent />}
      </div>
    </div>
  );
};

export default UserManagementPage;
