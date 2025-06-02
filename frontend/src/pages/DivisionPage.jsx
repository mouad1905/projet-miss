// frontend/src/pages/DivisionPageComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import '../css/ConsommableList.css'; // Ou le nom que vous avez choisi

// --- Composant AddDivisionForm ---
// (Peut être mis dans un fichier séparé : AddDivisionForm.jsx)
const AddDivisionForm = ({ onSave, onCancel, isLoading }) => {
  const [libelle, setLibelle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!libelle.trim()) {
      alert("Le libellé ne peut pas être vide.");
      return;
    }
    onSave({ libelle });
  };

  return (
    <div className="add-form-container" style={formContainerStyle}>
      <form onSubmit={handleSubmit} style={formStyle} method='post' action="http://127.0.0.1:8000/api/divisions">
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Ajouter une nouvelle division</h3>
        <div style={formGroupStyle}>
          <label htmlFor="libelle" style={labelStyle}>Libellé :</label>
          <input
            type="text"
            id="libelle"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            style={inputStyle}
            disabled={isLoading} // Désactive pendant le chargement
            required
          />
        </div>
        <div style={formActionsStyle}>
          <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel} disabled={isLoading} style={{ marginLeft: '10px' }}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

// Styles basiques pour le formulaire (à externaliser dans un CSS si vous le souhaitez)
const formContainerStyle = { /* ... (styles de la réponse précédente) ... */ };
const formStyle = { /* ... */ };
const formGroupStyle = { /* ... */ };
const labelStyle = { /* ... */ };
const inputStyle = { /* ... */ };
const formActionsStyle = { /* ... */ };
// --- Fin Composant AddDivisionForm ---


const DivisionPageComponent = () => {
  const [data, setData] = useState([]); // Initialisé à vide, sera chargé depuis l'API
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Pour l'état de chargement général de la page
  const [isSubmitting, setIsSubmitting] = useState(false); // Pour l'état de soumission du formulaire

  // États pour la pagination, la recherche (comme avant)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour charger les divisions depuis l'API
  const fetchDivisions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/divisions'); // Adaptez l'URL de votre API Laravel
      if (!response.ok) {
      let errorMessage = `Erreur HTTP ${response.status} (${response.statusText}).`;
      try {
        // Essayer de voir si le corps de la réponse contient plus d'infos (peut-être du JSON d'erreur)
        const errorBody = await response.json(); // Ou response.text() si ce n'est pas du JSON
        errorMessage += ` Détails: ${JSON.stringify(errorBody)}`;
      } catch (e) {
        // Le corps n'était pas du JSON ou il y a eu une autre erreur en essayant de le lire
        const errorText = await response.text().catch(() => "Impossible de lire le corps de la réponse.");
        console.error("Corps de la réponse d'erreur (non-JSON) :", errorText); // Affiche le HTML dans la console
        errorMessage += " La réponse du serveur n'était pas au format JSON attendu.";
      }
      throw new Error(errorMessage);
    }
      const divisionsFromApi = await response.json();
      setData(divisionsFromApi);
    } catch (error) {
      console.error("Erreur lors de la récupération des divisions:", error);
      alert(`Erreur lors de la récupération des divisions: ${error.message}`);
      setData([]); // Optionnel: vider les données en cas d'erreur
    } finally {
      setIsLoading(false);
    }
  }, []); // useCallback pour éviter des recréations inutiles si passée en dépendance

  // Charger les données initiales au montage du composant
  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]); // fetchDivisions est maintenant stable grâce à useCallback

  const handleAddDivision = async (newDivisionData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/divisions', { // Adaptez l'URL de votre API Laravel
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Ajoutez ici d'autres headers si nécessaire (ex: token CSRF pour Laravel, token d'authentification)
          // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') // Si vous utilisez Laravel Blade avec un meta tag CSRF
        },
        body: JSON.stringify(newDivisionData),
      });

      if (!response.ok) {
        // Essayer de lire le message d'erreur du backend s'il y en a un
        const errorData = await response.json().catch(() => ({ message: 'Une erreur est survenue lors de l\'ajout.' }));
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
      }

      const createdDivision = await response.json(); // La nouvelle division avec son ID
      
      // Option 1: Ajouter directement à l'état local (plus rapide pour l'UX)
      setData(prevData => [...prevData, createdDivision]);
      
      // Option 2: Recharger toutes les données pour garantir la cohérence (plus sûr)
      // await fetchDivisions(); // Décommentez si vous préférez cette approche

      setShowAddForm(false);
      alert(`Division "${createdDivision.libelle}" ajoutée avec succès !`);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la division:", error);
      alert(`Erreur lors de l'ajout : ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logique de filtrage et de pagination (inchangée)
  const filteredData = data.filter(item =>
    item.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (isLoading && data.length === 0) { // Afficher un message de chargement si les données initiales ne sont pas encore là
    return <div className="data-table-view" style={{textAlign: 'center', padding: '50px'}}>Chargement des divisions...</div>;
  }

  return (
    <div className="data-table-view">
      {showAddForm && (
        <AddDivisionForm
          onSave={handleAddDivision}
          onCancel={() => setShowAddForm(false)}
          isLoading={isSubmitting} // Passe l'état de soumission au formulaire
        />
      )}

      <header className="content-header">
        <h1>Liste des divisions</h1>
        <button className="btn btn-primary btn-add" onClick={() => setShowAddForm(true)}>
          + Ajouter une division
        </button>
      </header>

      <div className="controls-bar">
        {/* ... select et input de recherche ... */}
      </div>

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
            {isLoading && data.length > 0 && ( /* Indicateur de chargement discret si des données sont déjà affichées */
                <tr><td colSpan="3" style={{ textAlign: 'center', fontStyle: 'italic' }}>Mise à jour...</td></tr>
            )}
            {!isLoading && currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.libelle}</td>
                  <td><button className="btn btn-success btn-sm">Modifier</button></td>
                  <td><button className="btn btn-danger btn-sm">Effacer</button></td>
                </tr>
              ))
            ) : (
              !isLoading && <tr><td colSpan="3" style={{ textAlign: 'center' }}>Aucune division à afficher.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="content-footer-bar">
        {/* ... pagination et boutons d'export ... */}
      </footer>
    </div>
  );
};

export default DivisionPageComponent;

// RAPPEL: Les styles pour le formulaire (formContainerStyle, etc.) sont ceux de la réponse précédente.
// Il est fortement recommandé de les déplacer dans votre fichier CSS partagé.
// Par exemple, dans SharedTableView.css :
/*
.add-form-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.add-form-container form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  width: 400px;
  max-width: 90%;
}

.add-form-container .form-group {
  margin-bottom: 15px;
}

.add-form-container label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.add-form-container input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.add-form-container .form-actions {
  margin-top: 20px;
  text-align: right;
}
.add-form-container .form-actions .btn + .btn {
    margin-left: 10px;
}
*/