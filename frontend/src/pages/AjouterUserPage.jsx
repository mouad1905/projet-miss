import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Assurez-vous que ces chemins sont corrects
import '../css/ConsommableList.css'; // Styles partagés (boutons, etc.)
import '../css/AjouterUserPage.css';    // Styles spécifiques pour ce formulaire (que je vous ai donnés)

// Optionnel : Si vous utilisez AuthContext pour obtenir le token de l'admin qui crée l'utilisateur
// import { useAuth } from '../context/AuthContext';

const AddUserPageComponent = () => {
  const navigate = useNavigate();
  // const { token } = useAuth(); // Décommentez si l'action d'ajout est protégée et nécessite un token

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    nom_utilisateur: '',
    email: '',
    password: '',
    password_confirmation: '',
    num_telephone: '',
    cin: '',
    role: 'employe', // Valeur par défaut, ou la première de votre liste
    type_employer_id: '',
  });

  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null); // Pour stocker les erreurs de validation du backend
  const [successMessage, setSuccessMessage] = useState('');

  const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Adaptez si nécessaire

  // Charger les types d'employeur pour le <select>
  useEffect(() => {
    const fetchEmployeeTypes = async () => {
      // Simule un appel API pour les types d'employeur.
      // Remplacez ceci par votre véritable appel API si vous avez une table et une route pour cela.
      // Exemple:
      // try {
      //   const token = localStorage.getItem('authToken'); // ou depuis useAuth()
      //   const response = await fetch(`${API_BASE_URL}/employee-types`, {
      //     headers: {
      //       'Accept': 'application/json',
      //       ...(token && { 'Authorization': `Bearer ${token}` })
      //     }
      //   });
      //   if (!response.ok) throw new Error('Erreur chargement types employeur');
      //   const data = await response.json();
      //   setEmployeeTypes(data);
      // } catch (error) {
      //   console.error("Erreur chargement des types d'employeur:", error);
      //   setEmployeeTypes([]); // Laisser vide en cas d'erreur
      // }
      // Données simulées :
      setEmployeeTypes([
        { id: 1, libelle: 'Fonctionnaire' },
        { id: 2, libelle: 'Contractuel' },
        { id: 3, libelle: 'Stagiaire' },
        // Ajoutez d'autres types si nécessaire
      ]);
    };
    fetchEmployeeTypes();
  }, []); // Le tableau vide signifie que cela ne s'exécute qu'au montage

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

    const token = localStorage.getItem('authToken'); // Récupère le token si l'admin qui ajoute est connecté

    try {
      // Nous utilisons /api/register comme discuté, mais cela pourrait être une route dédiée /api/users
      const response = await fetch(`${API_BASE_URL}/register`, { // ou /users
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Si cette action est protégée et effectuée par un admin connecté :
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 422) { // Erreurs de validation de Laravel
          setErrors(responseData.errors); // Doit être un objet avec les erreurs par champ
        } else {
          // Autres erreurs serveur (500, 403, etc.)
          throw new Error(responseData.message || `Erreur HTTP ${response.status}`);
        }
      } else {
        setSuccessMessage(`Utilisateur "${responseData.user?.nom_utilisateur || formData.nom_utilisateur}" ajouté avec succès !`);
        // Réinitialiser le formulaire
        setFormData({
          nom: '', prenom: '', nom_utilisateur: '', email: '', password: '',
          password_confirmation: '', num_telephone: '', cin: '', role: 'employe', type_employer_id: ''
        });
        // Optionnel : Rediriger vers la liste des utilisateurs après un court délai
        // setTimeout(() => navigate('/referentiel/utilisateurs/liste'), 2000); // Créez cette route si besoin
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      // Afficher une erreur générale si ce n'est pas une erreur de validation déjà gérée
      if (!errors) { // S'il n'y a pas déjà des erreurs de validation affichées
          setErrors({ global: error.message || "Une erreur est survenue lors de l'ajout." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // La classe "data-table-view" est utilisée pour hériter des styles de page généraux
    // La classe "add-user-form-page" peut être utilisée pour des styles plus spécifiques si besoin
    <div className="data-table-view add-user-form-page">
      <header className="content-header">
        <h1>Ajouter un nouvel utilisateur</h1>
      </header>

      {successMessage && <div className="form-success-message">{successMessage}</div>}
      {errors?.global && <div className="form-error-message global-error">{errors.global}</div>}

      <form onSubmit={handleSubmit} className="user-form"> {/* Classe pour styler le formulaire */}
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
              {/* Adaptez ces rôles à ceux définis dans votre backend */}
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