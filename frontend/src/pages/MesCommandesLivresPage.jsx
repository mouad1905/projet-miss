import React, { useState, useEffect, useCallback } from 'react';
import { showSuccessToast, showErrorAlert } from '../utils/SwalAlerts';
import Loader from '../component/Loader';
import '../css/ConsommableList.css';

const MesCommandesLivresPageComponent = () => {
  const [commandes, setCommandes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('authToken');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/mes-commandes-livres`, { 
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
      });
      if (!response.ok) {
        throw new Error('Erreur de chargement de vos commandes livrées.');
      }
      setCommandes(await response.json());
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (demandeId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/demandes/${demandeId}/reception-status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ statut_livraison: newStatus })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du statut.');
      }
      
      setCommandes(prev => prev.map(cmd => 
        cmd.id === demandeId ? { ...cmd, statut_livraison: newStatus } : cmd
      ));
      showSuccessToast('Statut de réception mis à jour !');
    } catch (err) {
      showErrorAlert(err.message);
      fetchData();
    }
  };

  if (isLoading) {
    return <div className="data-table-view"><Loader /></div>;
  }

  return (
    <div className="data-table-view">
      <header className="content-header">
        <h1>Mes Commandes livré</h1>
      </header>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Article</th>
              <th>Statut de réception</th>
            </tr>
          </thead>
          <tbody>
            {commandes.length > 0 ? (
              commandes.map((item) => {
                const isFinalStatus = item.statut_livraison === 'Reçu' || item.statut_livraison === 'Non reçu';
                
                return (
                  <tr key={item.id}>
                    <td>{item.article?.libelle || 'N/A'}</td>
                    <td>
                      <select 
                        value={item.statut_livraison} 
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="table-select"
                        disabled={isFinalStatus}
                      >
                        <option value="Livré">En attente de réception</option>
                        <option value="Reçu">Reçu</option>
                        <option value="Non reçu">Non reçu</option>
                      </select>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr><td colSpan="2" style={{ textAlign: "center" }}>Aucune commande livrée à accuser pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MesCommandesLivresPageComponent;