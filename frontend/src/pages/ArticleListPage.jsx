// frontend/src/pages/ArticlePageComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { showSuccessToast, showErrorAlert, showConfirmDialog } from '../utils/SwalAlerts';
import Loader from '../component/Loader';
import '../css/ConsommableList.css';
import '../css/ArticleForm.css';

// --- Composant Formulaire pour Article (Modifié avec le nouveau style) ---
// MODIFICATION 1 : La prop destructurée ici est maintenant 'articleCategories'
const ArticleForm = ({ onSave, onCancel, isLoading, initialData = null, articleCategories = [] }) => {
  const [formData, setFormData] = useState({
    libelle: '', description: '', unite_mesure: '', cout_unitaire: '',
    seuil_expiration_jours: '', seuil_rupture_stock: '',
    article_category_id: '', type_consommable: '', type_stockage: '',
  });

  const isEditMode = !!initialData;
  const consommableOptions = ['Consommable', 'Non consommable'];
  const stockageOptions = ['Unité', 'Lot'];

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        libelle: initialData.libelle || '',
        description: initialData.description || '',
        unite_mesure: initialData.unite_mesure || '',
        cout_unitaire: initialData.cout_unitaire || '',
        seuil_expiration_jours: initialData.seuil_expiration_jours || '',
        seuil_rupture_stock: initialData.seuil_rupture_stock || '',
        article_category_id: initialData.article_category_id || '',
        type_consommable: initialData.type_consommable || '',
        type_stockage: initialData.type_stockage || '',
      });
    } else {
        setFormData({ libelle: '', description: '', unite_mesure: '', cout_unitaire: '', seuil_expiration_jours: '', seuil_rupture_stock: '', article_category_id: '', type_consommable: '', type_stockage: '' });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.libelle.trim() || !formData.article_category_id || !formData.type_consommable || !formData.type_stockage) {
        showErrorAlert('Veuillez remplir tous les champs obligatoires (*).');
        return;
    }
    onSave(formData, initialData ? initialData.id : null);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <form onSubmit={handleSubmit} className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? "Modifier l'article" : "Ajouter un article"}</h3>
          <button type="button" className="close-button" onClick={onCancel}>&times;</button>
        </div>
        
        <div className="form-grid">
            <div className="form-group">
                <label htmlFor="libelle">Libellé <span className="required-star">*</span></label>
                <input type="text" id="libelle" name="libelle" value={formData.libelle} onChange={handleChange} disabled={isLoading} required/>
            </div>
            <div className="form-group">
                <label htmlFor="unite_mesure">Unité de mesure</label>
                <input type="text" id="unite_mesure" name="unite_mesure" value={formData.unite_mesure} onChange={handleChange} disabled={isLoading}/>
            </div>
            <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} disabled={isLoading}></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="cout_unitaire">Coût unitaire</label>
                <input type="number" id="cout_unitaire" step="0.01" name="cout_unitaire" value={formData.cout_unitaire} onChange={handleChange} disabled={isLoading}/>
            </div>
            <div className="form-group">
                <label htmlFor="seuil_expiration_jours">Seuil d'alerte d'expiration (Jours)</label>
                <input type="number" id="seuil_expiration_jours" name="seuil_expiration_jours" value={formData.seuil_expiration_jours} onChange={handleChange} disabled={isLoading}/>
            </div>
             <div className="form-group">
                <label htmlFor="seuil_rupture_stock">Seuil de rupture de stock</label>
                <input type="number" id="seuil_rupture_stock" name="seuil_rupture_stock" value={formData.seuil_rupture_stock} onChange={handleChange} disabled={isLoading}/>
            </div>
            <div className="form-group">
                <label htmlFor="article_category_id">Catégorie d'article <span className="required-star">*</span></label>
                <select id="article_category_id" name="article_category_id" value={formData.article_category_id} onChange={handleChange} disabled={isLoading} required>
                    <option value="">Choisissez le type d'article</option>
                    {/* Le map se fait maintenant sur 'articleCategories' qui est bien un tableau */}
                    {articleCategories.map(c => <option key={c.id} value={c.id}>{c.libelle}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="type_consommable">Type de consommable <span className="required-star">*</span></label>
                <select id="type_consommable" name="type_consommable" value={formData.type_consommable} onChange={handleChange} disabled={isLoading} required>
                    <option value="">Choisissez le type de consommable</option>
                    {consommableOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="type_stockage">Type de Stockage <span className="required-star">*</span></label>
                <select id="type_stockage" name="type_stockage" value={formData.type_stockage} onChange={handleChange} disabled={isLoading} required>
                    <option value="">Choisissez le type de stockage</option>
                    {stockageOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel} disabled={isLoading}>Annuler</button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>{isLoading ? "Sauvegarde..." : "Sauvegarder"}</button>
        </div>
      </form>
    </div>
  );
};


const ArticlePageComponent = () => {
  const [data, setData] = useState([]);
  const [articleCategories, setArticleCategories] = useState([]); // L'état est un tableau vide
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDependencies, setIsLoadingDependencies] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('authToken');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsLoadingDependencies(true);
    try {
      const token = getToken();
      const headers = { 'Accept': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) };
      
      const [articlesRes, articleCatRes] = await Promise.all([
        fetch(`${API_BASE_URL}/articles`, { headers }),
        fetch(`${API_BASE_URL}/article-categories`, { headers }),
      ]);

      if (!articlesRes.ok || !articleCatRes.ok) {
        throw new Error('Erreur lors du chargement des données nécessaires.');
      }

      setData(await articlesRes.json());
      setArticleCategories(await articleCatRes.json()); // Met à jour l'état du tableau
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsLoading(false);
      setIsLoadingDependencies(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleOpenAddForm = () => { setEditingItem(null); setShowForm(true); };
  const handleOpenEditForm = (item) => { setEditingItem(item); setShowForm(true); };

  const handleFormSave = async (formData, itemId) => {
    setIsSubmitting(true);
    const isEditMode = !!itemId;
    const url = isEditMode ? `${API_BASE_URL}/articles/${itemId}` : `${API_BASE_URL}/articles`;
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
      fetchData();
      showSuccessToast(`Article ${isEditMode ? 'modifié' : 'ajouté'} avec succès`);
      setShowForm(false);
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = (itemId, itemLibelle) => {
    showConfirmDialog({ text: `Supprimer l'article "${itemLibelle}" ?`, confirmButtonText: 'Oui, supprimer!' })
      .then(async (result) => {
        if (result.isConfirmed) {
            setIsSubmitting(true);
            const token = getToken();
            try {
                const response = await fetch(`${API_BASE_URL}/articles/${itemId}`, {
                    method: 'DELETE',
                    headers: { 'Accept': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) }
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || `Erreur HTTP ${response.status}`);
                }
                setData(prevData => prevData.filter(item => item.id !== itemId));
                showSuccessToast('Article supprimé avec succès!');
            } catch (err) {
                showErrorAlert(err.message);
            } finally {
                setIsSubmitting(false);
            }
        }
    });
  };
  
  const filteredData = data.filter(item => item.libelle?.toLowerCase().includes(searchTerm.toLowerCase()));
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (isLoading) {
    return <div className="data-table-view"><Loader /></div>;
  }

  return (
    <div className="data-table-view">
      {showForm && (
        // MODIFICATION 2 : On passe la prop 'articleCategories' avec le tableau directement
        <ArticleForm
          onSave={handleFormSave}
          onCancel={() => setShowForm(false)}
          isLoading={isSubmitting}
          initialData={editingItem}
          articleCategories={articleCategories}
        />
      )}
      <header className="content-header">
        <h1>Liste des articles</h1>
        <button className="btn btn-primary btn-add" onClick={handleOpenAddForm} disabled={isLoadingDependencies}>
          {isLoadingDependencies ? 'Chargement...' : '+ Ajouter un article'}
        </button>
      </header>
      <div className="controls-bar">{/* ... Recherche et pagination ... */}</div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Libellé</th>
              <th>Description</th>
              <th>Coût</th>
              <th>Catégorie d'article</th>
              <th>Type Conso.</th>
              <th>Type Stock.</th>
              <th>Modifier</th>
              <th>Effacer</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.libelle}</td>
                  <td title={item.description}>{item.description?.substring(0, 20)}...</td>
                  <td>{item.cout_unitaire}</td>
                  <td>{item.article_category?.libelle || 'N/A'}</td>
                  <td>{item.type_consommable}</td>
                  <td>{item.type_stockage}</td>
                  <td><button className="btn btn-success btn-sm" onClick={() => handleOpenEditForm(item)}>Modifier</button></td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item.id, item.libelle)}>Effacer</button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" style={{ textAlign: "center" }}>Aucun article à afficher.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="content-footer-bar">{/* ... */}</footer>
    </div>
  );
};

export default ArticlePageComponent;
