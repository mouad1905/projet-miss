import React, { useState, useEffect, useCallback } from 'react';

// Importez vos utilitaires et composants partagés
import { showSuccessToast, showErrorAlert, showConfirmDialog } from '../utils/SwalAlerts';
import Loader from '../component/Loader';
// Assurez-vous que le chemin vers le bon fichier CSS est importé
import '../css/ConsommableList.css'; // <<<--- Assurez-vous que c'est le bon chemin vers votre CSS

// --- Composant Formulaire ---
const TypeEmployeurForm = ({ onSave, onCancel, isLoading, initialData = null }) => {
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
    // Ce formulaire utilise ses propres classes (add-form-container) qui sont dans votre CSS
    <div className="add-form-container">
      <form onSubmit={handleSubmit}>
        <h3>
          {isEditMode ? "Modifier le type d'employer" : "Ajouter un type d'employer"}
        </h3>
        <div className="form-group">
          <label htmlFor="libelle-form">Libellé :</label>
          <input type="text" id="libelle-form" value={libelle} onChange={(e) => setLibelle(e.target.value)} disabled={isLoading} required />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel} disabled={isLoading}>Annuler</button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>{isLoading ? "Sauvegarde..." : "Sauvegarder"}</button>
        </div>
      </form>
    </div>
  );
};


const TypeEmployeurPageComponent = () => {
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
      const response = await fetch(`${API_BASE_URL}/employee-types`, { headers });
      if (!response.ok) throw new Error('Erreur lors du chargement des types d\'employer.');
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
    const url = isEditMode ? `${API_BASE_URL}/employee-types/${itemId}` : `${API_BASE_URL}/employee-types`;
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
      showSuccessToast(`Type d'employer ${isEditMode ? 'modifié' : 'ajouté'} avec succès`);
      setShowForm(false);
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = (itemId, itemLibelle) => {
    showConfirmDialog({
      text: `Supprimer le type d'employer "${itemLibelle}" ?`,
      confirmButtonText: 'Oui, supprimer!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        const token = getToken();
        try {
          const response = await fetch(`${API_BASE_URL}/employee-types/${itemId}`, {
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
    return (
      // Utilisation de la classe de votre CSS existant
      <main className="main-content-consommable">
        <Loader />
      </main>
    );
  }

  return (
    // Utilisation de la classe de votre CSS existant
    <main className="main-content-consommable">
      {showForm && (
        <TypeEmployeurForm
          onSave={handleFormSave}
          onCancel={() => setShowForm(false)}
          isLoading={isSubmitting}
          initialData={editingItem}
        />
      )}
      <header className="content-header">
        <h1>Liste des types d'employer</h1>
        <button className="btn btn-primary btn-add" onClick={handleOpenAddForm}>
          + Ajouter un type d'employer
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
              <th>Libellé <span className="sort-arrow">↕</span></th>
              <th>Modifier <span className="sort-arrow">↕</span></th>
              <th>Effacer <span className="sort-arrow">↕</span></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
                <tr><td colSpan="3"><Loader /></td></tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.libelle}</td>
                  {/* Utilisation des classes CSS correctes pour les boutons */}
                  <td><button className="btn btn-success btn-sm" onClick={() => handleOpenEditForm(item)}>Modifier</button></td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item.id, item.libelle)}>Effacer</button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" style={{ textAlign: "center" }}>Aucun type d'employer à afficher.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Utilisation de la classe de votre CSS existant */}
      <footer className="content-footer">
        <div className="pagination-info">Affichage de l'élement 1 à {currentItems.length} sur {filteredData.length} éléments</div>
        <div className="pagination-controls">
            <button className="btn btn-secondary" disabled={currentPage === 1}>Précédent</button>
            <button className="btn btn-page active">1</button>
            <button className="btn btn-secondary">Suivant</button>
        </div>
        <div className="export-buttons">
            <button className="btn btn-secondary">Export PDF</button>
            <button className="btn btn-secondary">Export Excel</button>
        </div>
      </footer>
    </main>
  );
};

export default TypeEmployeurPageComponent;
