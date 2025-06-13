// frontend/src/pages/LesCommandesLivresPageComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { showErrorAlert, showSuccessToast} from '../utils/SwalAlerts';
import Loader from '../component/Loader';
import '../css/ConsommableList.css';

const LesCommandesLivresPageComponent = () => {
  const [commandes, setCommandes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('authToken');

  // Fonction pour récupérer les commandes livrées
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/commandes-livres`, { 
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
      });
      if (!response.ok) throw new Error('Erreur de chargement des commandes livrées.');
      setCommandes(await response.json());
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Logique pour la sélection des lignes
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

  const isAllSelected = commandes.length > 0 && selectedRows.size === commandes.length;

  // Logique pour le filtrage et la pagination
  const filteredData = commandes.filter(item =>
    (item.article?.libelle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.fournisseur?.nom_entreprise.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.user?.service?.libelle.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);


  if (isLoading && commandes.length === 0) {
    return <div className="data-table-view"><Loader /></div>;
  }

  return (
    <div className="data-table-view">
      <header className="content-header">
        <h1>Les Commandes livrés</h1>
        {/* Un bouton d'action pour les lignes sélectionnées pourrait être ici, ex: "Archiver" */}
      </header>
      <div className="controls-bar">
        <div className="entries-selector">
          Afficher <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
            <option value="10">10</option><option value="25">25</option><option value="50">50</option>
          </select> éléments
        </div>
        <div className="search-bar">
          Rechercher: <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} /></th>
              <th>QR Code</th>
              <th>Article</th>
              <th>Division</th>
              <th>Service</th>
              <th>Bureau</th>
              <th>Fournisseur</th>
              <th>Statut Livraison</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="8"><Loader /></td></tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id} className={selectedRows.has(item.id) ? 'selected-row' : ''}>
                  <td><input type="checkbox" checked={selectedRows.has(item.id)} onChange={() => handleRowSelect(item.id)} /></td>
                  <td>{item.qr_code || 'QR-' + item.id}</td>
                  <td>{item.article?.libelle || 'N/A'}</td>
                  <td>{item.user?.service?.division?.libelle || 'N/A'}</td>
                  <td>{item.user?.service?.libelle || 'N/A'}</td>
                  <td>{"Bureau X"}</td> {/* Mettez ici la bonne information si disponible */}
                  <td>{item.fournisseur?.nom_entreprise || 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${item.statut_livraison?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {item.statut_livraison}
                    </span>
                  </td>
                </tr>
              ))
            ) : ( 
              <tr><td colSpan="8" style={{ textAlign: "center" }}>Aucune commande livrée à afficher.</td></tr> 
            )}
          </tbody>
        </table>
      </div>
      <footer className="content-footer-bar">
        <div className="pagination-info">
          Affichage de l'élément {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} à {Math.min(currentPage * itemsPerPage, filteredData.length)} sur {filteredData.length} éléments
        </div>
        <div className="pagination-controls">
          <button className="btn btn-secondary btn-sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Précédent</button>
          {[...Array(totalPages).keys()].map(number => (
             <button key={number + 1} className={`btn btn-page btn-sm ${currentPage === number + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(number + 1)}>{number + 1}</button>
          ))}
          <button className="btn btn-secondary btn-sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}>Suivant</button>
        </div>
        <div className="export-buttons">
          <button className="btn btn-secondary btn-sm">Export PDF</button>
          <button className="btn btn-secondary btn-sm">Export Excel</button>
        </div>
      </footer>
    </div>
  );
};

export default LesCommandesLivresPageComponent;
