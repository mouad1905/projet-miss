// frontend/src/pages/MesDemandesPageComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { showSuccessToast, showErrorAlert, showConfirmDialog } from '../utils/SwalAlerts';
import Loader from '../component/Loader';
import '../css/ConsommableList.css'; // Assurez-vous que ce chemin est correct
import '../css/DemandeForm.css'; 

// --- Formulaire de Demande (sans Observation) ---
const DemandeForm = ({ onSave, onCancel, isLoading, initialData = null, articlesList = [] }) => {
  const [formData, setFormData] = useState({ article_id: '', quantite_demandee: '1' });
  const isEditMode = !!initialData;
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({ article_id: initialData.article_id || '', quantite_demandee: initialData.quantite_demandee || '1' });
    } else {
      setFormData({ article_id: '', quantite_demandee: '1' });
    }
  }, [initialData, isEditMode]);
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.article_id) return showErrorAlert('Veuillez choisir un article.');
    if (parseInt(formData.quantite_demandee, 10) <= 0) return showErrorAlert('La quantité doit être supérieure à zéro.');
    onSave(formData, initialData ? initialData.id : null);
  };
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <form onSubmit={handleSubmit} className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>{isEditMode ? "Modifier la demande" : "Ajouter une demande"}</h3><button type="button" className="close-button" onClick={onCancel}>&times;</button></div>
        <div className="form-group"><label htmlFor="article_id">Article <span className="required-star">*</span></label><select id="article_id" name="article_id" value={formData.article_id} onChange={handleChange} disabled={isLoading} required><option value="">Choisir l'article</option>{articlesList.map(article => <option key={article.id} value={article.id}>{article.libelle}</option>)}</select></div>
        <div className="form-group"><label htmlFor="quantite_demandee">Quantité <span className="required-star">*</span></label><input type="number" id="quantite_demandee" name="quantite_demandee" value={formData.quantite_demandee} onChange={handleChange} min="1" disabled={isLoading} required /></div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary btn-sm" onClick={onCancel} disabled={isLoading}>Annuler</button><button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>{isLoading ? "Sauvegarde..." : (isEditMode ? "Modifier" : "Ajouter")}</button></div>
      </form>
    </div>
  );
};

const MesDemandesPageComponent = () => {
  const [data, setData] = useState([]);
  const [articlesList, setArticlesList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDependencies, setIsLoadingDependencies] = useState(false);

  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('authToken');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsLoadingDependencies(true);
    try {
      const token = getToken();
      const headers = { 'Accept': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) };
      const [demandesRes, articlesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/demandes/my-demandes`, { headers }),
          fetch(`${API_BASE_URL}/articles`, { headers })
      ]);
      if (!demandesRes.ok || !articlesRes.ok) throw new Error('Erreur de chargement des données.');
      setData(await demandesRes.json());
      setArticlesList(await articlesRes.json());
    } catch (err) { showErrorAlert(err.message); } finally {
      setIsLoading(false);
      setIsLoadingDependencies(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOpenAddForm = () => { setEditingItem(null); setShowForm(true); };
  const handleOpenEditForm = (item) => { setEditingItem(item); setShowForm(true); };

  const handleFormSave = async (formData, itemId) => {
    setIsSubmitting(true);
    const isEditMode = !!itemId;
    const url = isEditMode ? `${API_BASE_URL}/demandes/${itemId}` : `${API_BASE_URL}/demandes`;
    const method = isEditMode ? 'PUT' : 'POST';
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || (responseData.errors ? Object.values(responseData.errors).flat().join(' ') : 'Erreur serveur'));
      }
      fetchData();
      showSuccessToast(`Demande ${isEditMode ? 'modifiée' : 'ajoutée'} avec succès`);
      setShowForm(false);
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = (itemId, articleName) => {
    showConfirmDialog({ text: `Voulez-vous vraiment supprimer la demande pour "${articleName}" ?`, confirmButtonText: "Oui, supprimer" })
      .then(async (result) => {
        if (result.isConfirmed) {
            setIsSubmitting(true);
            try {
                const response = await fetch(`${API_BASE_URL}/demandes/${itemId}`, { method: 'DELETE', headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` } });
                if (!response.ok) { throw new Error((await response.json().catch(() => null))?.message || 'Erreur lors de la suppression.'); }
                setData(prevData => prevData.filter(item => item.id !== itemId));
                showSuccessToast('Demande supprimée avec succès!');
            } catch (err) { showErrorAlert(err.message); } finally { setIsSubmitting(false); }
        }
    });
  };

  const getStatusDisplay = (status) => status?.toLowerCase() === 'accepté' || status?.toLowerCase() === 'rejeté' ? status : 'En cours';

  if (isLoading) return <div className="data-table-view"><Loader /></div>;

  return (
    <div className="data-table-view">
      {showForm && (
        <DemandeForm onSave={handleFormSave} onCancel={() => setShowForm(false)} isLoading={isSubmitting} initialData={editingItem} articlesList={articlesList} />
      )}
      <header className="content-header">
        <h1>Liste de mes demandes</h1>
        <button className="btn btn-primary btn-add" onClick={handleOpenAddForm} disabled={isLoadingDependencies}>
          {isLoadingDependencies ? 'Chargement...' : '+ Ajouter une demande'}
        </button>
      </header>
      <div className="table-container">
        <table>
          <thead><tr><th>Article</th><th>Quantité</th><th>Status</th><th>Modifier</th><th>Effacer</th></tr></thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => {
                const displayStatus = getStatusDisplay(item.status);
                const isActionable = displayStatus === 'En cours';
                return (
                  <tr key={item.id}>
                    <td>{item.article?.libelle || 'N/A'}</td>
                    <td>{item.quantite_demandee}</td>
                    <td><span className={`status-badge status-${displayStatus.toLowerCase().replace(/\s+/g, '-')}`}>{displayStatus}</span></td>
                    <td><button className="btn btn-success btn-sm" onClick={() => handleOpenEditForm(item)} disabled={!isActionable}>Modifier</button></td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item.id, item.article?.libelle)} disabled={!isActionable}>Effacer</button></td>
                  </tr>
                )
              })
            ) : ( <tr><td colSpan="5" style={{ textAlign: "center" }}>Vous n'avez aucune demande en cours.</td></tr> )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MesDemandesPageComponent;
