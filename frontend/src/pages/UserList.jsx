// src/components/UserListComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { showErrorAlert } from '../utils/SwalAlerts'; // Pour les notifications d'erreur
import Loader from '../component/Loader'; // Votre composant de chargement

const UserListComponent = () => {
  // 1. ÉTAT (useState) : On crée un "tiroir" (state) pour stocker la liste des utilisateurs.
  // Il est vide au début.
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('authToken');

  // 2. RÉCUPÉRATION DES DONNÉES (useEffect + fetch)
  // Cette fonction est appelée une seule fois au chargement du composant.
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const headers = {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      
      // On fait un appel GET à l'API Laravel sur la route que nous avons définie.
      const response = await fetch(`${API_BASE_URL}/users`, { headers });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs.');
      }
      const responseData = await response.json();
      
      // 3. MISE À JOUR DE L'ÉTAT : On remplit notre "tiroir" avec les données reçues.
      setUsers(responseData);

    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isLoading) {
    return <Loader />;
  }

  // 4. AFFICHAGE (Render) : On génère le tableau HTML.
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Nom Complet</th>
            <th>Nom d'utilisateur</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Service</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/*
            On boucle sur chaque 'user' dans notre état 'users'.
            Pour chaque utilisateur, on crée une ligne de tableau (<tr>).
          */}
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{`${user.prenom} ${user.nom}`}</td>
                <td>{user.nom_utilisateur}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                {/* On affiche le nom du service. Grâce à `with('service')` dans le contrôleur Laravel,
                  l'objet 'service' est inclus avec chaque utilisateur.
                */}
                <td>{user.service?.libelle || 'N/A'}</td>
                <td>
                  <button className="btn btn-success btn-sm">Modifier</button>
                  <button className="btn btn-danger btn-sm" style={{marginLeft: '5px'}}>Effacer</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" style={{ textAlign: "center" }}>Aucun utilisateur trouvé.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserListComponent;
