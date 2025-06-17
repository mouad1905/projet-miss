import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import '../css/ConsommableList.css';

const DivisionForm = ({ onSave, onCancel, isLoading, initialData = null }) => {
  const [libelle, setLibelle] = useState('');
  const isEditMode = !!initialData;

  useEffect(() => {
    if (isEditMode && initialData && initialData.libelle) {
      setLibelle(initialData.libelle);
    } else {
      setLibelle('');
    }
  }, [initialData, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!libelle.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Le libellé ne peut pas être vide!',
      });
      return;
    }
    onSave({ libelle }, initialData ? initialData.id : null);
  };

  return (
    <div className="add-form-container" style={formContainerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {isEditMode ? 'Modifier la division' : 'Ajouter une nouvelle division'}
        </h3>
        <div style={formGroupStyle}>
          <label htmlFor="libelle-form" style={labelStyle}>Libellé :</label>
          <input
            type="text"
            id="libelle-form"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
            required
          />
        </div>
        <div style={formActionsStyle}>
          <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>
            {isLoading ? (isEditMode ? 'Modification...' : 'Enregistrement...') : (isEditMode ? 'Modifier' : 'Enregistrer')}
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel} disabled={isLoading} style={{ marginLeft: '10px' }}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

const formContainerStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 };
const formStyle = { background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', width: '400px', maxWidth: '90%' };
const formGroupStyle = { marginBottom: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
const formActionsStyle = { marginTop: '20px', textAlign: 'right' };


const DivisionPageComponent = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDivision, setEditingDivision] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  const getToken = () => localStorage.getItem('authToken');

  const fetchDivisions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/divisions`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erreur HTTP ${response.status}` }));
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
      }
      const divisionsFromApi = await response.json();
      setData(divisionsFromApi);
    } catch (err) {
      console.error("Erreur lors de la récupération des divisions:", err);
      Swal.fire('Erreur!', `Erreur lors de la récupération des divisions: ${err.message}`, 'error');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  const handleOpenAddForm = () => {
    setEditingDivision(null);
    setShowForm(true);
  };

  const handleOpenEditForm = (division) => {
    setEditingDivision(division);
    setShowForm(true);
  };

  const handleFormSave = async (formData, divisionId) => {
    setIsSubmitting(true);
    const isEditMode = !!divisionId;
    const url = isEditMode ? `${API_BASE_URL}/divisions/${divisionId}` : `${API_BASE_URL}/divisions`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.message || 
                               (responseData.errors ? Object.values(responseData.errors).flat().join(' ') : `Erreur HTTP ${response.status}`);
        throw new Error(errorMessage);
      }
      
      const savedDivision = responseData; 

      if (isEditMode) {
        setData(prevData => prevData.map(item => item.id === divisionId ? savedDivision : item));
        Swal.fire('Modifié!', `Division "${savedDivision.libelle}" modifiée avec succès.`, 'success');
      } else {
        setData(prevData => [...prevData, savedDivision]);
        Swal.fire('Ajouté!', `Division "${savedDivision.libelle}" ajoutée avec succès.`, 'success');
      }
      setShowForm(false);
      setEditingDivision(null);
    } catch (err) {
      console.error(`Erreur lors de ${isEditMode ? 'la modification' : 'l\'ajout'} de la division:`, err);
      Swal.fire('Erreur!', err.message || `Une erreur est survenue lors de ${isEditMode ? 'la modification' : 'l\'ajout'}.`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDivision = (divisionId, divisionLibelle) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: `Vous êtes sur le point de supprimer la division "${divisionLibelle}". Cette action est irréversible!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        try {
          const response = await fetch(`${API_BASE_URL}/divisions/${divisionId}`, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${getToken()}`
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || `Erreur HTTP ${response.status} lors de la suppression.`;
            throw new Error(errorMessage);
          }
          
          setData(prevData => prevData.filter(item => item.id !== divisionId));
          Swal.fire('Supprimé!', `La division "${divisionLibelle}" a été supprimée.`, 'success');

        } catch (err) {
          console.error("Erreur lors de la suppression de la division:", err);
          Swal.fire('Erreur!', err.message || 'Une erreur est survenue lors de la suppression.', 'error');
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  const filteredData = data.filter(item =>
    item.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (isLoading && data.length === 0) {
    return <div className="data-table-view" style={{textAlign: 'center', padding: '50px'}}>Chargement des divisions...</div>;
  }

  return (
    <div className="data-table-view">
      {showForm && (
        <DivisionForm
          onSave={handleFormSave}
          onCancel={() => { setShowForm(false); setEditingDivision(null); }}
          isLoading={isSubmitting}
          initialData={editingDivision}
        />
      )}

      <header className="content-header">
        <h1>Liste des divisions</h1>
        <button className="btn btn-primary btn-add" onClick={handleOpenAddForm}>
          + Ajouter une division
        </button>
      </header>
      
      <div className="controls-bar"> </div>

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
            {isSubmitting && !showForm && <tr><td colSpan="3" style={{ textAlign: 'center', fontStyle: 'italic' }}>Opération en cours...</td></tr>}
            {!isSubmitting && currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.libelle}</td>
                  <td>
                    <button 
                      className="btn btn-success btn-sm" 
                      onClick={() => handleOpenEditForm(item)}
                      disabled={isSubmitting}
                    >
                      Modifier
                    </button>
                  </td>
                  <td>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDeleteDivision(item.id, item.libelle)}
                      disabled={isSubmitting}
                    >
                      Effacer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              !isSubmitting && !isLoading && <tr><td colSpan="3" style={{ textAlign: 'center' }}>Aucune division à afficher.</td></tr>
            )}
            {isLoading && data.length > 0 && (
                <tr><td colSpan="3" style={{ textAlign: 'center', fontStyle: 'italic' }}>Chargement...</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="content-footer-bar"> </footer>
    </div>
  );
};

export default DivisionPageComponent;