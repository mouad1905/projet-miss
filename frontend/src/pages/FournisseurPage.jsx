import React, { useState, useEffect, useCallback } from 'react';
import { showSuccessToast, showErrorAlert, showConfirmDialog } from '../utils/SwalAlerts';
import Loader from '../component/Loader';
import '../css/ConsommableList.css';

const FournisseurForm = ({ onSave, onCancel, isLoading, initialData = null }) => {
  const [formData, setFormData] = useState({
    nom_entreprise: '',
    ice: '',
    num_compte_bancaire: '',
    num_telephone: '',
  });

  const isEditMode = !!initialData;

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        nom_entreprise: initialData.nom_entreprise || '',
        ice: initialData.ice || '',
        num_compte_bancaire: initialData.num_compte_bancaire || '',
        num_telephone: initialData.num_telephone || '',
      });
    } else {
        setFormData({ nom_entreprise: '', ice: '', num_compte_bancaire: '', num_telephone: '' });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nom_entreprise.trim()) {
      showErrorAlert('Le nom de l\'entreprise est obligatoire.');
      return;
    }
    onSave(formData, initialData ? initialData.id : null);
  };

  return (
    <div className="add-form-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', width: '500px', maxWidth: '90%' }}>
        <h3 style={{ textAlign: "center", marginBottom: "25px" }}>
          {isEditMode ? "Modifier le fournisseur" : "Ajouter un fournisseur"}
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor="nom_entreprise" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Nom de l'entreprise *</label>
            <input type="text" id="nom_entreprise" name="nom_entreprise" value={formData.nom_entreprise} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }} disabled={isLoading} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor="ice" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>ICE</label>
            <input type="text" id="ice" name="ice" value={formData.ice} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }} disabled={isLoading} />
        </div>
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor="num_compte_bancaire" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Numéro de compte bancaire</label>
            <input type="text" id="num_compte_bancaire" name="num_compte_bancaire" value={formData.num_compte_bancaire} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }} disabled={isLoading} />
        </div>
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor="num_telephone" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Numéro de téléphone</label>
            <input type="tel" id="num_telephone" name="num_telephone" value={formData.num_telephone} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }} disabled={isLoading} />
        </div>

        <div style={{ marginTop: "25px", textAlign: "right", display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel} disabled={isLoading}>Annuler</button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>{isLoading ? "Sauvegarde..." : "Sauvegarder"}</button>
        </div>
      </form>
    </div>
  );
};


const FournisseurPageComponent = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await fetch(`${API_BASE_URL}/fournisseurs`, { headers });
      if (!response.ok) throw new Error('Erreur lors du chargement des fournisseurs.');
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

  const handleOpenAddForm = () => { setEditingItem(null); setShowForm(true); };
  const handleOpenEditForm = (item) => { setEditingItem(item); setShowForm(true); };

  const handleFormSave = async (formData, itemId) => {
    setIsSubmitting(true);
    const isEditMode = !!itemId;
    const url = isEditMode ? `${API_BASE_URL}/fournisseurs/${itemId}` : `${API_BASE_URL}/fournisseurs`;
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
      showSuccessToast(`Fournisseur ${isEditMode ? 'modifié' : 'ajouté'} avec succès`);
      setShowForm(false);
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = (itemId, itemName) => {
    showConfirmDialog({
      text: `Supprimer le fournisseur "${itemName}" ?`,
      confirmButtonText: 'Oui, supprimer!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        const token = getToken();
        try {
          const response = await fetch(`${API_BASE_URL}/fournisseurs/${itemId}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Erreur HTTP ${response.status}`);
          }
          setData(prevData => prevData.filter(item => item.id !== itemId));
          showSuccessToast('Fournisseur supprimé avec succès!');
        } catch (err) {
          showErrorAlert(err.message);
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  const filteredData = data.filter(item =>
    (item.nom_entreprise && item.nom_entreprise.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.ice && item.ice.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (isLoading && data.length === 0) {
    return <div className="data-table-view"><Loader /></div>;
  }

  return (
    <div className="data-table-view">
      {showForm && (
        <FournisseurForm
          onSave={handleFormSave}
          onCancel={() => setShowForm(false)}
          isLoading={isSubmitting}
          initialData={editingItem}
        />
      )}
      <header className="content-header">
        <h1>Liste des fournisseurs</h1>
        <button className="btn btn-primary btn-add" onClick={handleOpenAddForm}>
          + Ajouter un fournisseur
        </button>
      </header>
      <div className="controls-bar"></div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nom de l'entreprise</th>
              <th>ICE</th>
              <th>Téléphone</th>
              <th>Compte Bancaire</th>
              <th>Modifier</th>
              <th>Effacer</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
                <tr><td colSpan="6"><Loader /></td></tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.nom_entreprise}</td>
                  <td>{item.ice}</td>
                  <td>{item.num_telephone}</td>
                  <td>{item.num_compte_bancaire}</td>
                  <td><button className="btn btn-success btn-sm" onClick={() => handleOpenEditForm(item)}>Modifier</button></td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item.id, item.nom_entreprise)}>Effacer</button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>Aucun fournisseur à afficher.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="content-footer-bar"></footer>
    </div>
  );
};

export default FournisseurPageComponent;