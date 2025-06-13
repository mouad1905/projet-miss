// frontend/src/pages/LesCommandesLivresPageComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { showErrorAlert, showSuccessToast} from '../utils/SwalAlerts';
import Loader from '../component/Loader';
import '../css/ConsommableList.css';

const LesCommandesPageComponent = () => {
  const [commandes, setCommandes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('authToken');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const headers = { 'Accept': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) };
      const response = await fetch(`${API_BASE_URL}/commandes`, { headers });
      if (!response.ok) throw new Error('Erreur de chargement des commandes.');
      setCommandes(await response.json());
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRowSelect = (id) => {
    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
      return newSelected;
    });
  };

  const handleSelectAll = (e) => {
    setSelectedRows(e.target.checked ? new Set(commandes.map(c => c.id)) : new Set());
  };
  
  const handleMarkAsDelivered = async () => {
    if (selectedRows.size === 0) {
      showErrorAlert('Veuillez sélectionner au moins une commande à marquer comme livrée.');
      return;
    }
    setIsSubmitting(true);
    try {
        const response = await fetch(`${API_BASE_URL}/commandes/mark-delivered`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify({ ids: Array.from(selectedRows) }),
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Erreur serveur.');
        showSuccessToast('Commandes marquées comme livrées !');
        setSelectedRows(new Set()); // Vider la sélection
        fetchData(); // Recharger la liste pour que les éléments livrés disparaissent
    } catch (err) { 
        showErrorAlert(err.message); 
    } finally { 
        setIsSubmitting(false); 
    }
  };

  const isAllSelected = commandes.length > 0 && selectedRows.size === commandes.length;

  if (isLoading) {
    return <div className="data-table-view"><Loader /></div>;
  }

  return (
    <div className="data-table-view">
      <header className="content-header">
        <h1>Les Commandes à préparer</h1>
      </header>
      <div className="controls-bar">{/* Filtres... */}</div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} /></th>
              <th>Désignation</th>
              <th>Fournisseur</th>
              <th>Quantité</th>
              <th>Demandeur</th>
              <th>Date de la commande</th>
            </tr>
          </thead>
          <tbody>
            {commandes.length > 0 ? (
              commandes.map((item) => (
                <tr key={item.id} className={selectedRows.has(item.id) ? 'selected-row' : ''}>
                  <td><input type="checkbox" checked={selectedRows.has(item.id)} onChange={() => handleRowSelect(item.id)} /></td>
                  <td>{item.article?.libelle || 'N/A'}</td>
                  <td>{item.fournisseur?.nom_entreprise || 'Non assigné'}</td>
                  <td>{item.quantite_demandee}</td>
                  <td>{`${item.user?.prenom || ''} ${item.user?.nom || 'N/A'}`}</td>
                  <td>{new Date(item.date_demande).toLocaleDateString()}</td>
                </tr>
              ))
            ) : ( 
              <tr><td colSpan="6" style={{ textAlign: "center" }}>Aucune commande à préparer.</td></tr> 
            )}
          </tbody>
        </table>
      </div>
      
      {/* --- CORRECTION ICI --- */}
      {/* Utilisation de la balise <footer> et de la classe 'content-footer-bar' pour la cohérence */}
      <footer className="content-footer-bar">
        {/* On peut ajouter une div vide pour pousser le bouton à droite si le CSS du footer est basé sur space-between */}
        <div className="pagination-info">
          {selectedRows.size} commande(s) sélectionnée(s)
        </div>
        
        {/* Vous pouvez ajouter la pagination ici si nécessaire */}
        <div></div>
        <div className="export-buttons">
            <button 
              className="btn btn-primary" 
              onClick={handleMarkAsDelivered} 
              disabled={isSubmitting || selectedRows.size === 0}
            >
                {isSubmitting ? 'Envoi...' : 'Marquer comme livré'}
            </button>
        </div>
      </footer>
    </div>
  );
};


export default LesCommandesPageComponent;
