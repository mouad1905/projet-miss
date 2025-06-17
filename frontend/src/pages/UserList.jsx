import React, { useState, useEffect, useCallback } from 'react';
import { showErrorAlert } from '../utils/SwalAlerts';
import Loader from '../component/Loader';

const UserListComponent = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('authToken');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const headers = {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      
      const response = await fetch(`${API_BASE_URL}/users`, { headers });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs.');
      }
      const responseData = await response.json();
      
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
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{`${user.prenom} ${user.nom}`}</td>
                <td>{user.nom_utilisateur}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
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