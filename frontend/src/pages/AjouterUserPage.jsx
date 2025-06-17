import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ConsommableList.css'; 
import '../css/AjouterUserPage.css';   

const AddUserPageComponent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    nom_utilisateur: '',
    email: '',
    password: '',
    password_confirmation: '',
    num_telephone: '',
    cin: '',
    role: 'employe', 
    type_employer_id: '',
  });

  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null); 
  const [successMessage, setSuccessMessage] = useState('');

  const API_BASE_URL = 'http://127.0.0.1:8000/api'; 

  useEffect(() => {
    const fetchEmployeeTypes = async () => {
      setEmployeeTypes([
        { id: 1, libelle: 'Fonctionnaire' },
        { id: 2, libelle: 'Contractuel' },
        { id: 3, libelle: 'Stagiaire' },
      ]);
    };
    fetchEmployeeTypes();
  }, []); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors(null);
    setSuccessMessage('');

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: ["La confirmation du mot de passe ne correspond pas."] });
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('authToken'); 

    try {
      const response = await fetch(`${API_BASE_URL}/register`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 422) { 
          setErrors(responseData.errors); 
        } else {
          throw new Error(responseData.message || `Erreur HTTP ${response.status}`);
        }
      } else {
        setSuccessMessage(`Utilisateur "${responseData.user?.nom_utilisateur || formData.nom_utilisateur}" ajouté avec succès !`);
        setFormData({
          nom: '', prenom: '', nom_utilisateur: '', email: '', password: '',
          password_confirmation: '', num_telephone: '', cin: '', role: 'employe', type_employer_id: ''
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      if (!errors) { 
        setErrors({ global: error.message || "Une erreur est survenue lors de l'ajout." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="data-table-view add-user-form-page">
      <header className="content-header">
        <h1>Ajouter un nouveau utilisateur</h1>
      </header>

      {successMessage && <div className="form-success-message">{successMessage}</div>}
      {errors?.global && <div className="form-error-message global-error">{errors.global}</div>}

      <form onSubmit={handleSubmit} className="user-form"> 
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nom">Nom <span className="required">*</span></label>
            <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
            {errors?.nom && <span className="error-text">{errors.nom[0]}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="prenom">Prénom <span className="required">*</span></label>
            <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} required />
            {errors?.prenom && <span className="error-text">{errors.prenom[0]}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nom_utilisateur">Nom d'utilisateur <span className="required">*</span></label>
            <input type="text" id="nom_utilisateur" name="nom_utilisateur" value={formData.nom_utilisateur} onChange={handleChange} required />
            {errors?.nom_utilisateur && <span className="error-text">{errors.nom_utilisateur[0]}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            {errors?.email && <span className="error-text">{errors.email[0]}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Mot de passe <span className="required">*</span></label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
            {errors?.password && <span className="error-text">{errors.password[0]}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password_confirmation">Confirmer le mot de passe <span className="required">*</span></label>
            <input type="password" id="password_confirmation" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required />
            {errors?.password_confirmation && <span className="error-text">{errors.password_confirmation[0]}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="num_telephone">Numéro de téléphone</label>
            <input type="tel" id="num_telephone" name="num_telephone" value={formData.num_telephone} onChange={handleChange} />
            {errors?.num_telephone && <span className="error-text">{errors.num_telephone[0]}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="cin">CIN</label>
            <input type="text" id="cin" name="cin" value={formData.cin} onChange={handleChange} />
            {errors?.cin && <span className="error-text">{errors.cin[0]}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="role">Rôle <span className="required">*</span></label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} required>
              <option value="employe">Employé</option>
              <option value="manager">Manager</option>
              <option value="admin">Administrateur</option>
            </select>
            {errors?.role && <span className="error-text">{errors.role[0]}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="type_employer_id">Type d'employeur</label>
            <select id="type_employer_id" name="type_employer_id" value={formData.type_employer_id} onChange={handleChange}>
              <option value="">Sélectionnez un type</option>
              {employeeTypes.map(type => (
                <option key={type.id} value={type.id}>{type.libelle}</option>
              ))}
            </select>
            {errors?.type_employer_id && <span className="error-text">{errors.type_employer_id[0]}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer l'utilisateur"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} disabled={isLoading}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserPageComponent;