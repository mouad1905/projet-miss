// frontend/src/pages/LesCommandesPageComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { showSuccessToast, showErrorAlert } from '../utils/SwalAlerts';
import Loader from '../component/Loader';
import '../css/ConsommableList.css';

const LesCommandesPageComponent = () => {
  const [commandes, setCommandes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // Pour gérer les lignes sélectionnées

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

  // Gère la sélection d'une seule ligne
  const handleRowSelect = (id) => {
    setSelectedRows(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  // Gère la sélection de toutes les lignes
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(commandes.map(c => c.id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const isAllSelected = commandes.length > 0 && selectedRows.size === commandes.length;

  if (isLoading) {
    return <div className="data-table-view"><Loader /></div>;
  }

  return (
    <div className="data-table-view">
      <header className="content-header">
        <h1>Les Commandes</h1>
        {/* Vous pourriez avoir un bouton ici pour générer un bon de commande par exemple */}
      </header>
      <div className="controls-bar">{/* Filtres... */}</div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Désignation</th>
              <th>Fournisseur</th>
              <th>Quantité</th>
              <th>Demandeur</th>
              <th>Date de la commande</th>
              {/* La colonne Status a été supprimée */}
            </tr>
          </thead>
          <tbody>
            {commandes.length > 0 ? (
              commandes.map((item) => (
                <tr key={item.id} className={selectedRows.has(item.id) ? 'selected-row' : ''}>
                  <td>
                    <input 
                      type="checkbox"
                      checked={selectedRows.has(item.id)}
                      onChange={() => handleRowSelect(item.id)}
                    />
                  </td>
                  <td>{item.article?.libelle || 'N/A'}</td>
                  <td>{item.fournisseur?.nom_entreprise || 'Non assigné'}</td>
                  <td>{item.quantite_demandee}</td>
                  <td>{`${item.user?.prenom || ''} ${item.user?.nom || 'N/A'}`}</td>
                  <td>{new Date(item.date_demande).toLocaleDateString()}</td>
                  {/* Le <td> pour le statut a été supprimé */}
                </tr>
              ))
            ) : (
              // Le colSpan est maintenant de 6 au lieu de 7
              <tr><td colSpan="6" style={{ textAlign: "center" }}>Aucune commande à afficher.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="content-footer-bar">{/* Pagination et Exports */}</footer>
    </div>
  );
};

export default LesCommandesPageComponent;
