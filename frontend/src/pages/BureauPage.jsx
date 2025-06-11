import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Importations des utilitaires et styles
import { showSuccessToast, showErrorAlert, showConfirmDialog } from '../utils/SwalAlerts'; // Assurez-vous que le chemin est correct
import Loader from '../component/Loader'; // Assurez-vous que le chemin est correct
import '../css/ConsommableList.css'; // Votre CSS partagé

// --- Composant BureauForm ---
const BureauForm = ({ onSave, onCancel, isLoading, initialData = null, divisionsList = [], servicesList = [] }) => {
  const [libelle, setLibelle] = useState('');
  const [abreviation, setAbreviation] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [serviceId, setServiceId] = useState('');
  
  const isEditMode = !!initialData;

  // Filtrer les services basés sur la division sélectionnée
  const filteredServices = divisionId ? servicesList.filter(s => s.division_id == divisionId) : [];

  useEffect(() => {
    if (isEditMode && initialData) {
      setLibelle(initialData.libelle || '');
      setAbreviation(initialData.abreviation || '');
      // Pré-remplir la division et le service
      const initialService = initialData.service;
      if (initialService) {
        setDivisionId(initialService.division_id || '');
        setServiceId(initialService.id || '');
      } else {
         setDivisionId('');
         setServiceId('');
      }
    } else {
      // Réinitialiser pour le mode ajout
      setLibelle('');
      setAbreviation('');
      setDivisionId('');
      setServiceId('');
    }
  }, [initialData, isEditMode]);

  const handleDivisionChange = (e) => {
    setDivisionId(e.target.value);
    setServiceId(''); // Réinitialiser le service quand la division change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!libelle.trim() || !abreviation.trim() || !serviceId) {
      showErrorAlert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    onSave({ libelle, abreviation, service_id: serviceId }, initialData ? initialData.id : null);
  };

  return (
    <div className="add-form-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', width: '500px', maxWidth: '90%' }}>
        <h3 style={{ textAlign: "center", marginBottom: "25px" }}>
          {isEditMode ? "Modifier le bureau" : "Ajouter un nouveau bureau"}
        </h3>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="libelle-bureau-form" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Libellé :</label>
          <input type="text" id="libelle-bureau-form" value={libelle} onChange={(e) => setLibelle(e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }} disabled={isLoading} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="abreviation-bureau-form" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Abréviation :</label>
          <input type="text" id="abreviation-bureau-form" value={abreviation} onChange={(e) => setAbreviation(e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }} disabled={isLoading} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="division-bureau-form" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Division :</label>
          <select id="division-bureau-form" value={divisionId} onChange={handleDivisionChange} style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }} disabled={isLoading} required>
            <option value="">Choisissez la division</option>
            {divisionsList.map(d => <option key={d.id} value={d.id}>{d.libelle}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="service-bureau-form" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Service :</label>
          <select id="service-bureau-form" value={serviceId} onChange={(e) => setServiceId(e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }} disabled={!divisionId || isLoading} required>
            <option value="">Choisissez le service</option>
            {filteredServices.map(s => <option key={s.id} value={s.id}>{s.libelle}</option>)}
          </select>
        </div>
        <div style={{ marginTop: "25px", textAlign: "right", display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel} disabled={isLoading}>Annuler</button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>{isLoading ? "Sauvegarde..." : "Sauvegarder"}</button>
        </div>
      </form>
    </div>
  );
};


const BureauPageComponent = () => {
  const [data, setData] = useState([]); // Liste des bureaux
  const [divisionsList, setDivisionsList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBureau, setEditingBureau] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDependencies, setIsLoadingDependencies] = useState(false);

  // Pagination et recherche
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
      
      // Récupérer bureaux, divisions, et services en parallèle
      const [bureauxRes, divisionsRes, servicesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/bureaux`, { headers }),
        fetch(`${API_BASE_URL}/divisions`, { headers }),
        fetch(`${API_BASE_URL}/services`, { headers }),
      ]);

      if (!bureauxRes.ok) throw new Error('Erreur chargement bureaux');
      if (!divisionsRes.ok) throw new Error('Erreur chargement divisions');
      if (!servicesRes.ok) throw new Error('Erreur chargement services');

      setData(await bureauxRes.json());
      setDivisionsList(await divisionsRes.json());
      setServicesList(await servicesRes.json());

    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err);
      showErrorAlert(err.message || 'Une erreur est survenue lors du chargement des données.');
    } finally {
      setIsLoading(false);
      setIsLoadingDependencies(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenAddForm = () => {
    if (isLoadingDependencies) {
      Swal.fire('Veuillez patienter', 'Chargement des données nécessaires...', 'info');
      return;
    }
    setEditingBureau(null);
    setShowForm(true);
  };

  const handleOpenEditForm = (bureau) => {
    setEditingBureau(bureau);
    setShowForm(true);
  };

  const handleFormSave = async (formData, bureauId) => {
    setIsSubmitting(true);
    const isEditMode = !!bureauId;
    const url = isEditMode ? `${API_BASE_URL}/bureaux/${bureauId}` : `${API_BASE_URL}/bureaux`;
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
      
      fetchData(); // Recharger toutes les données pour la cohérence
      showSuccessToast(`Bureau ${isEditMode ? 'modifié' : 'ajouté'} avec succès`);
      setShowForm(false);
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBureau = (bureauId, bureauLibelle) => {
    showConfirmDialog({
      text: `Supprimer le bureau "${bureauLibelle}" ?`,
      confirmButtonText: 'Oui, supprimer!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        const token = getToken();
        try {
          const response = await fetch(`${API_BASE_URL}/bureaux/${bureauId}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Erreur HTTP ${response.status}`);
          }
          setData(prevData => prevData.filter(item => item.id !== bureauId));
          showSuccessToast('Bureau supprimé avec succès!');
        } catch (err) {
          showErrorAlert(err.message);
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  const filteredData = data.filter(item =>
    (item.libelle && item.libelle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.abreviation && item.abreviation.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.service && item.service.libelle && item.service.libelle.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (isLoading) {
    return <div className="data-table-view"><Loader /></div>;
  }

  return (
    <div className="data-table-view">
      {showForm && (
        <BureauForm
          onSave={handleFormSave}
          onCancel={() => setShowForm(false)}
          isLoading={isSubmitting}
          initialData={editingBureau}
          divisionsList={divisionsList}
          servicesList={servicesList}
        />
      )}
      <header className="content-header">
        <h1>Liste des bureaux</h1>
        <button className="btn btn-primary btn-add" onClick={handleOpenAddForm} disabled={isLoadingDependencies}>
          {isLoadingDependencies ? 'Chargement...' : '+ Ajouter un bureau'}
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
              <th>Abréviation</th>
              <th>Service</th>
              <th>Modifier</th>
              <th>Effacer</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.libelle}</td>
                  <td>{item.abreviation}</td>
                  <td>{item.service?.libelle || 'N/A'}</td>
                  <td><button className="btn btn-success btn-sm" onClick={() => handleOpenEditForm(item)}>Modifier</button></td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteBureau(item.id, item.libelle)}>Effacer</button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{ textAlign: "center" }}>Aucun bureau à afficher.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="content-footer-bar">{/* ... Pagination et Exports ... */}</footer>
    </div>
  );
};

export default BureauPageComponent;
