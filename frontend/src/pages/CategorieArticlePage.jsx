import React, { useState, useEffect, useCallback } from 'react';

// Importez vos utilitaires et composants partagés
import { showSuccessToast, showErrorAlert, showConfirmDialog } from '../utils/SwalAlerts';
import Loader from '../component/Loader';
import '../css/ConsommableList.css';// Assurez-vous que le chemin est correct

// --- Composant Formulaire ---
const CategorieArticleForm = ({ onSave, onCancel, isLoading, initialData = null }) => {
  const [libelle, setLibelle] = useState('');
  const isEditMode = !!initialData;

  useEffect(() => {
    if (isEditMode && initialData) {
      setLibelle(initialData.libelle || '');
    } else {
      setLibelle('');
    }
  }, [initialData, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!libelle.trim()) {
      showErrorAlert('Le libellé ne peut pas être vide.');
      return;
    }
    onSave({ libelle }, initialData ? initialData.id : null);
  };

  return (
    <div className="add-form-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', width: '450px', maxWidth: '90%' }}>
        <h3 style={{ textAlign: "center", marginBottom: "25px" }}>
          {isEditMode ? "Modifier la catégorie" : "Ajouter une catégorie d'article"}
        </h3>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="libelle-form" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Libellé :</label>
          <input type="text" id="libelle-form" value={libelle} onChange={(e) => setLibelle(e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }} disabled={isLoading} required />
        </div>
        <div style={{ marginTop: "25px", textAlign: "right", display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel} disabled={isLoading}>Annuler</button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>{isLoading ? "Sauvegarde..." : "Sauvegarder"}</button>
        </div>
      </form>
    </div>
  );
};


const CategorieArticlePageComponent = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination et recherche
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('authToken');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const headers = { 'Accept': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) };
      const response = await fetch(`${API_BASE_URL}/article-categories`, { headers });
      if (!response.ok) throw new Error('Erreur lors du chargement des catégories d\'articles.');
      const responseData = await response.json();
      setData(responseData);
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenAddForm = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleOpenEditForm = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormSave = async (formData, itemId) => {
    setIsSubmitting(true);
    const isEditMode = !!itemId;
    const url = isEditMode ? `${API_BASE_URL}/article-categories/${itemId}` : `${API_BASE_URL}/article-categories`;
    const method = isEditMode ? 'PUT' : 'POST';
    const token = getToken();

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const responseData = await response.json();
        const errorMessage = responseData.message || (responseData.errors ? Object.values(responseData.errors).flat().join(' ') : `Erreur HTTP ${response.status}`);
        throw new Error(errorMessage);
      }
      fetchData(); // Recharger les données
      showSuccessToast(`Catégorie ${isEditMode ? 'modifiée' : 'ajoutée'} avec succès`);
      setShowForm(false);
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = (itemId, itemLibelle) => {
    showConfirmDialog({
      text: `Supprimer la catégorie "${itemLibelle}" ?`,
      confirmButtonText: 'Oui, supprimer!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        const token = getToken();
        try {
          const response = await fetch(`${API_BASE_URL}/article-categories/${itemId}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Erreur HTTP ${response.status}`);
          }
          setData(prevData => prevData.filter(item => item.id !== itemId));
          showSuccessToast('Supprimé avec succès!');
        } catch (err) {
          showErrorAlert(err.message);
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  const filteredData = data.filter(item =>
    (item.libelle && item.libelle.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (isLoading && data.length === 0) {
    return <div className="data-table-view"><Loader /></div>;
  }

  return (
    <div className="data-table-view">
      {showForm && (
        <CategorieArticleForm
          onSave={handleFormSave}
          onCancel={() => setShowForm(false)}
          isLoading={isSubmitting}
          initialData={editingItem}
        />
      )}
      <header className="content-header">
        <h1>Liste des catégories des articles</h1>
        <button className="btn btn-primary btn-add" onClick={handleOpenAddForm}>
          + Ajouter une catégorie d'article
        </button>
      </header>
      <div className="controls-bar">
        <div className="entries-selector">
            Afficher <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}><option value="10">10</option><option value="25">25</option><option value="50">50</option></select> éléments
        </div>
        <div className="search-bar">
            Rechercher: <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Libellé</th>
              <th>Modifier</th>
              <th>Effacer</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
                <tr><td colSpan="3"><Loader /></td></tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.libelle}</td>
                  <td><button className="btn btn-success btn-sm" onClick={() => handleOpenEditForm(item)}>Modifier</button></td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item.id, item.libelle)}>Effacer</button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" style={{ textAlign: "center" }}>Aucune catégorie à afficher.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="content-footer-bar">{/* ... Pagination et Exports ... */}</footer>
    </div>
  );
};

export default CategorieArticlePageComponent;
