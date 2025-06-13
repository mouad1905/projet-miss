// frontend/src/pages/LesDemandesPageComponent.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { showSuccessToast, showErrorAlert } from '../utils/SwalAlerts';
import Loader from '../component/Loader';
import '../css/ConsommableList.css'; // Assurez-vous que ce chemin est correct
import '../css/DemandeForm.css'; 

const LesDemandesPageComponent = () => {
  const [demandes, setDemandes] = useState([]);
  const [fournisseursList, setFournisseursList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [changes, setChanges] = useState({});
  const [filesToUpload, setFilesToUpload] = useState({});
  const fileInputRefs = useRef({});

  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('authToken');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const headers = { 'Accept': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) };
      
      const [demandesRes, fournisseursRes] = await Promise.all([
        fetch(`${API_BASE_URL}/demandes`, { headers }),
        fetch(`${API_BASE_URL}/fournisseurs`, { headers })
      ]);

      if (!demandesRes.ok) throw new Error('Erreur de chargement des demandes.');
      if (!fournisseursRes.ok) throw new Error('Erreur de chargement des fournisseurs.');

      setDemandes(await demandesRes.json());
      setFournisseursList(await fournisseursRes.json());
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRowChange = (demandeId, field, value) => {
    setChanges(prev => ({ ...prev, [demandeId]: { ...prev[demandeId], [field]: value }}));
  };

  const handleFileChange = (demandeId, file) => {
    setFilesToUpload(prev => ({ ...prev, [demandeId]: file }));
  };

  const handleConfirmChanges = async () => {
    const files = Object.entries(filesToUpload);
    if (Object.keys(changes).length === 0 && files.length === 0) {
        return showErrorAlert('Aucune modification à enregistrer.');
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('updates', JSON.stringify(changes));
    files.forEach(([id, file]) => {
      formData.append(`files[${id}]`, file);
    });
    try {
        const response = await fetch(`${API_BASE_URL}/demandes/batch-update`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: formData,
        });
        const responseData = await response.json();
        if (!response.ok) throw new Error(responseData.message || 'Erreur lors de la mise à jour.');
        showSuccessToast('Modifications enregistrées avec succès!');
        setChanges({});
        setFilesToUpload({});
        fetchData();
    } catch (err) {
        showErrorAlert(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="data-table-view"><Loader /></div>;

  return (
    <div className="data-table-view">
      <header className="content-header"><h1>Liste des demandes</h1></header>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Désignation</th>
              <th>Quantité</th>
              <th>Service</th>
              <th>Demandeur</th>
              <th>Date de la demande</th>
              <th>Status</th>
              <th>Fournisseur</th>
              <th>Fichier</th>
            </tr>
          </thead>
          <tbody>
            {demandes.length > 0 ? (
              demandes.map((item) => {
                const currentStatus = changes[item.id]?.status ?? item.status;
                const currentFournisseur = changes[item.id]?.fournisseur_id ?? item.fournisseur_id;
                const selectedFileName = filesToUpload[item.id]?.name;
                if (!fileInputRefs.current[item.id]) { fileInputRefs.current[item.id] = React.createRef(); }
                return (
                  <tr key={item.id}>
                    <td>{item.article?.libelle || 'N/A'}</td>
                    <td>{item.quantite_demandee}</td>
                    <td>{item.user?.service?.libelle || 'N/A'}</td>
                    <td>{`${item.user?.prenom || ''} ${item.user?.nom || 'N/A'}`}</td>
                    <td>{new Date(item.date_demande).toLocaleDateString()}</td>
                    <td>
                      <select value={currentStatus} onChange={(e) => handleRowChange(item.id, 'status', e.target.value)} className="table-select">
                        <option value="En cours">En cours</option>
                        <option value="Accepté">Accepté</option>
                        <option value="Rejeté">Rejeté</option>
                      </select>
                    </td>
                    <td>
                      <select value={currentFournisseur || ''} onChange={(e) => handleRowChange(item.id, 'fournisseur_id', e.target.value)} className="table-select">
                        <option value="">Choisir un fournisseur</option>
                        {fournisseursList.map(f => <option key={f.id} value={f.id}>{f.nom_entreprise}</option>)}
                      </select>
                    </td>
                    <td>
                      <input type="file" ref={fileInputRefs.current[item.id]} className="file-upload-input" onChange={(e) => handleFileChange(item.id, e.target.files[0])} />
                      <button className="btn btn-secondary btn-sm" onClick={() => fileInputRefs.current[item.id].current.click()}>{selectedFileName ? 'Changer' : 'Choisir'}</button>
                      {selectedFileName && <span className="file-name-display">{selectedFileName}</span>}
                    </td>
                  </tr>
                )
              })
            ) : ( <tr><td colSpan="8" style={{ textAlign: "center" }}>Aucune demande à traiter.</td></tr> )}
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <button className="btn btn-primary" onClick={handleConfirmChanges} disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : 'Confirmer les demandes'}
        </button>
      </div>
    </div>
  );
};

export default LesDemandesPageComponent;
