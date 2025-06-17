import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import "../css/ConsommableList.css";
import Loader from "../component/Loader";

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

const getToken = () => localStorage.getItem("authToken");

const ServiceForm = ({ onSave, onCancel, isLoading, initialData = null, divisionsList = [] }) => {
  const [libelle, setLibelle] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const isEditMode = !!initialData;

  useEffect(() => {
    if (isEditMode && initialData) {
      setLibelle(initialData.libelle || "");
      setDivisionId(
        initialData.division_id ||
          (initialData.division ? initialData.division.id : "")
      );
    } else {
      setLibelle("");
      setDivisionId("");
    }
  }, [initialData, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!libelle.trim()) {
      Swal.fire("Erreur!", "Le libellé ne peut pas être vide.", "error");
      return;
    }
    if (!divisionId) {
      Swal.fire("Erreur!", "Veuillez sélectionner une division.", "error");
      return;
    }
    onSave(
      { libelle, division_id: divisionId },
      initialData ? initialData.id : null
    );
  };

  return (
    <div className="add-form-container" style={formContainerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          {isEditMode ? "Modifier le service" : "Ajouter un nouveau service"}
        </h3>
        <div style={formGroupStyle}>
          <label htmlFor="libelle-service-form" style={labelStyle}>Libellé :</label>
          <input
            type="text"
            id="libelle-service-form"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="division-service-form" style={labelStyle}>Division :</label>
          <select
            id="division-service-form"
            value={divisionId}
            onChange={(e) => setDivisionId(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
            required
          >
            <option value="">Sélectionnez une division</option>
            {divisionsList.map((division) => (
              <option key={division.id} value={division.id}>
                {division.libelle}
              </option>
            ))}
          </select>
        </div>
        <div style={formActionsStyle}>
          <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>
            {isLoading ? (isEditMode ? "Modification..." : "Enregistrement...") : (isEditMode ? "Modifier" : "Enregistrer")}
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel} disabled={isLoading} style={{ marginLeft: "10px" }}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

const formContainerStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 };
const formStyle = { background: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 5px 15px rgba(0,0,0,0.3)", width: "450px", maxWidth: "90%" };
const formGroupStyle = { marginBottom: "15px" };
const labelStyle = { display: "block", marginBottom: "5px", fontWeight: "bold" };
const inputStyle = { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" };
const formActionsStyle = { marginTop: "20px", textAlign: "right" };

const ServicePageComponent = () => {
    const [data, setData] = useState([]);
    const [divisionsList, setDivisionsList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDivisions, setIsLoadingDivisions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const API_BASE_URL = "http://127.0.0.1:8000/api";

    const fetchAllDivisions = useCallback(async () => {
        setIsLoadingDivisions(true);
        try {
            const currentToken = getToken();
            const response = await fetch(`${API_BASE_URL}/divisions`, { headers: { Accept: "application/json", ...(currentToken && { Authorization: `Bearer ${currentToken}` }) } });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erreur HTTP ${response.status} lors du chargement des divisions` }));
                throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
            }
            const divisionsData = await response.json();
            setDivisionsList(divisionsData);
        } catch (err) {
            Swal.fire("Erreur!", err.message || "Impossible de charger la liste des divisions pour le formulaire.", "error");
        } finally {
            setIsLoadingDivisions(false);
        }
    }, [API_BASE_URL]);

    const fetchServices = useCallback(async () => {
        setIsLoading(true);
        try {
            const currentToken = getToken();
            const response = await fetch(`${API_BASE_URL}/services`, { headers: { Accept: "application/json", ...(currentToken && { Authorization: `Bearer ${currentToken}` }) } });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erreur HTTP ${response.status}` }));
                throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
            }
            const servicesFromApi = await response.json();
            setData(servicesFromApi);
        } catch (err) {
            Swal.fire("Erreur!", `Erreur lors de la récupération des services: ${err.message}`, "error");
            setData([]);
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchServices();
        fetchAllDivisions();
    }, [fetchServices, fetchAllDivisions]);

    const handleOpenAddForm = () => {
        if (isLoadingDivisions) {
            Swal.fire("Veuillez patienter", "Chargement des données nécessaires...", "info");
            return;
        }
        if (divisionsList.length === 0) {
            Swal.fire("Attention", "Aucune division n'est disponible pour créer un service. Veuillez d'abord ajouter des divisions.", "warning");
            return;
        }
        setEditingService(null);
        setShowForm(true);
    };

    const handleOpenEditForm = (service) => {
        if (isLoadingDivisions) {
            Swal.fire('Veuillez patienter', 'Chargement des données nécessaires...', 'info');
            return;
        }
        setEditingService(service);
        setShowForm(true);
    };

    const handleFormSave = async (formData, serviceId) => {
        setIsSubmitting(true);
        const isEditMode = !!serviceId;
        const url = isEditMode ? `${API_BASE_URL}/services/${serviceId}` : `${API_BASE_URL}/services`;
        const method = isEditMode ? "PUT" : "POST";
        const currentToken = getToken();
        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json", Accept: "application/json", ...(currentToken && { Authorization: `Bearer ${currentToken}` }) },
                body: JSON.stringify(formData),
            });
            const responseData = await response.json();
            if (!response.ok) {
                const errorMessage = responseData.message || (responseData.errors ? Object.values(responseData.errors).flat().join(" ") : `Erreur HTTP ${response.status}`);
                throw new Error(errorMessage);
            }
            const savedService = responseData;
            fetchServices();
            
            Toast.fire({
                icon: 'success',
                title: `Service ${isEditMode ? 'modifié' : 'ajouté'} avec succès`
            });

            setShowForm(false);
            setEditingService(null);
        } catch (err) {
            Swal.fire("Erreur!", err.message || `Une erreur est survenue.`, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteService = (serviceId, serviceLibelle) => {
        Swal.fire({
            title: 'Êtes-vous sûr?',
            text: `Supprimer le service "${serviceLibelle}"? Cette action est irréversible!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer!',
            cancelButtonText: 'Annuler'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsSubmitting(true);
                const currentToken = getToken();
                try {
                    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
                        method: "DELETE",
                        headers: { Accept: "application/json", ...(currentToken && { Authorization: `Bearer ${currentToken}` }) }
                    });
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => null);
                        const errorMessage = errorData?.message || `Erreur HTTP ${response.status}`;
                        throw new Error(errorMessage);
                    }
                    setData((prevData) => prevData.filter((item) => item.id !== serviceId));
                    
                    Toast.fire({
                        icon: 'success',
                        title: 'Supprimé avec succès!'
                    });

                } catch (err) {
                    Swal.fire("Erreur!", err.message || "Erreur lors de la suppression.", "error");
                } finally {
                    setIsSubmitting(false);
                }
            }
        });
    };

    const filteredData = data.filter((item) =>(item.libelle && item.libelle.toLowerCase().includes(searchTerm.toLowerCase())) || (item.division && item.division.libelle && item.division.libelle.toLowerCase().includes(searchTerm.toLowerCase())));
    const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    if (isLoading && data.length === 0) {
        return (
          <div className="data-table-view">
              <Loader />
          </div>
        );
    }
 
    return (
        <div className="data-table-view">
            {showForm && (
                <ServiceForm
                    onSave={handleFormSave}
                    onCancel={() => { setShowForm(false); setEditingService(null); }}
                    isLoading={isSubmitting}
                    initialData={editingService}
                    divisionsList={divisionsList}
                />
            )}
            <header className="content-header">
                <h1>Liste des services</h1>
                <button className="btn btn-primary btn-add" onClick={handleOpenAddForm} disabled={isLoadingDivisions}>
                    {isLoadingDivisions ? "Chargement..." : "+ Ajouter un service"}
                </button>
            </header>
            <div className="controls-bar">
                <div className="entries-selector">
                    Afficher{' '}
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>{' '}
                    éléments
                </div>
                <div className="search-bar">
                    Rechercher: <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            <div className="table-container">
                <table>
                    <thead><tr><th>Libellé <span className="sort-arrow">↕</span></th><th>Division <span className="sort-arrow">↕</span></th><th>Modifier <span className="sort-arrow">↕</span></th><th>Effacer <span className="sort-arrow">↕</span></th></tr></thead>
                    
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="4">
                                    <Loader />
                                </td>
                            </tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.libelle}</td>
                                    <td>{item.division ? item.division.libelle : "N/A"}</td>
                                    <td>
                                        <button className="btn btn-success btn-sm" onClick={() => handleOpenEditForm(item)} disabled={isSubmitting}>
                                            Modifier
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteService(item.id, item.libelle)} disabled={isSubmitting}>
                                            Effacer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>
                                    Aucun service à afficher.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
             <footer className="content-footer-bar">
                <div className="pagination-info">Affichage de l'élément {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} à {Math.min(currentPage * itemsPerPage, filteredData.length)} sur {filteredData.length} éléments</div>
                <div className="pagination-controls"></div>
                <div className="export-buttons"><button className="btn btn-secondary btn-sm">Export PDF</button><button className="btn btn-secondary btn-sm">Export Excel</button></div>
            </footer>
        </div>
    );
};

export default ServicePageComponent;