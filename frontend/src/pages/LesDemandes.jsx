// frontend/src/pages/LesDemandesPageComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { showSuccessToast, showErrorAlert } from '../utils/SwalAlerts';
import Loader from '../component/Loader';
import '../css/ConsommableList.css';

const LesDemandesPageComponent = () => {
  const [demandes, setDemandes] = useState([]);
  const [fournisseursList, setFournisseursList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // État pour stocker les changements faits par l'admin
  const [changes, setChanges] = useState({});

  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('authToken');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const headers = { 'Accept': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) };
      
      const [demandesRes, fournisseursRes] = await Promise.all([
        fetch(`${API_BASE_URL}/demandes`, { headers }), // Récupère toutes les demandes
        fetch(`${API_BASE_URL}/fournisseurs`, { headers }) // Récupère tous les fournisseurs
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

  // Gère le changement d'un select dans une ligne
  const handleRowChange = (demandeId, field, value) => {
    setChanges(prev => ({
      ...prev,
      [demandeId]: {
        ...prev[demandeId],
        [field]: value
      }
    }));
  };

  // Envoie toutes les modifications au backend
  const handleConfirmChanges = async () => {
    const updates = Object.keys(changes).map(id => ({ id, ...changes[id] }));
    
    if (updates.length === 0) {
      showErrorAlert('Aucune modification à enregistrer.');
      return;
    }

    setIsSubmitting(true);
    try {
        const response = await fetch(`${API_BASE_URL}/demandes/batch-update`, {
            method: 'POST', // ou PUT
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify({ updates: updates }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la mise à jour.');
        }
        showSuccessToast('Modifications enregistrées avec succès!');
        setChanges({}); // Vider les changements après sauvegarde
        fetchData(); // Recharger les données
    } catch (err) {
        showErrorAlert(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="data-table-view"><Loader /></div>;

  return (
    <div className="data-table-view">
      <header className="content-header">
        <h1>Liste des demandes</h1>
      </header>
      <div className="controls-bar">{/* Filtres pour "Les Demandes" */}</div>
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
                return (
                  <tr key={item.id}>
                    <td>{item.article?.libelle || 'N/A'}</td>
                    <td>{item.quantite_demandee}</td>
                    <td>{item.user?.service?.libelle || 'N/A'}</td>
                    <td>{`${item.user?.prenom || ''} ${item.user?.nom || ''}`}</td>
                    <td>{new Date(item.date_demande).toLocaleDateString()}</td>
                    <td>
                      <select 
                        value={currentStatus} 
                        onChange={(e) => handleRowChange(item.id, 'status', e.target.value)}
                        className="table-select"
                      >
                        <option value="En cours">En cours</option>
                        <option value="Accepté">Accepté</option>
                        <option value="Rejeté">Rejeté</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        value={currentFournisseur || ''}
                        onChange={(e) => handleRowChange(item.id, 'fournisseur_id', e.target.value)}
                        className="table-select"
                      >
                        <option value="">Choisir un fournisseur</option>
                        {fournisseursList.map(f => <option key={f.id} value={f.id}>{f.nom_entreprise}</option>)}
                      </select>
                    </td>
                    <td><button className="btn btn-secondary btn-sm">Fichier</button></td>
                  </tr>
                )
              })
            ) : (
              <tr><td colSpan="8" style={{ textAlign: "center" }}>Aucune demande à traiter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <button className="btn btn-primary" onClick={handleConfirmChanges} disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : 'Confirmer les modifications'}
        </button>
      </div>
    </div>
  );
};

export default LesDemandesPageComponent;
