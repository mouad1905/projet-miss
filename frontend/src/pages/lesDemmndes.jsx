// src/pages/MesDemandesPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import '../css/ConsommableTable.css'; // Importez vos styles globaux

const MesDemandesPage = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [articleFilter, setArticleFilter] = useState(''); // État pour le filtre Article
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false); // Pour le formulaire d'ajout
  const [newItem, setNewItem] = useState({
    article: '',
    quantite: '',
    observation: '',
  });

  // Données factices pour le tableau
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData([
        { id: 1, article: 'Fax', quantite: 4, observation: 'J\'ai accepté', status: 'En stock' },
        { id: 2, article: 'Ecran', quantite: 3, observation: 'J\'ai accepté', status: 'En stock' },
        { id: 3, article: 'Laptop', quantite: 5, observation: 'J\'ai accepté', status: 'En stock' },
        { id: 4, article: 'Iphone', quantite: 3, observation: 'J\'ai accepté', status: 'En stock' },
        { id: 5, article: 'Clavier', quantite: 3, observation: 'J\'ai accepté', status: 'En stock' },
        { id: 6, article: 'PC Bureau', quantite: 10, observation: 'J\'ai accepté', status: 'En stock' },
        { id: 7, article: 'Fax', quantite: 2, observation: 'J\'ai accepté', status: 'En stock' },
        { id: 8, article: 'Souris', quantite: 6, observation: 'En attente', status: 'Hors stock' },
        { id: 9, article: 'Casque', quantite: 1, observation: 'Urgent', status: 'En stock' },
        { id: 10, article: 'Imprimante', quantite: 2, observation: 'Pour bureau', status: 'En stock' },
        { id: 11, article: 'Projecteur', quantite: 1, observation: 'Salle de réunion', status: 'Hors stock' },
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Filtrage des données du tableau
  const filteredData = useMemo(() => {
    let currentData = data;

    // Filtrage par le champ "Article"
    if (articleFilter) {
      currentData = currentData.filter(item =>
        item.article.toLowerCase().includes(articleFilter.toLowerCase())
      );
    }

    // Filtrage par la barre de recherche globale (sur toutes les valeurs)
    if (searchTerm) {
      currentData = currentData.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return currentData;
  }, [data, articleFilter, searchTerm]);

  // Logique de pagination
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleArticleFilterChange = (e) => {
    setArticleFilter(e.target.value);
    setCurrentPage(1); // Réinitialiser la page si le filtre article change
  };

  const handleFilterClick = () => {
    // Les filtres sont déjà appliqués via useMemo. Cette fonction pourrait être pour des filtres plus complexes
    console.log("Filtres appliqués!");
  };

  const handleResetFilters = () => {
    setArticleFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddNewItem = (e) => {
    e.preventDefault();
    if (newItem.article && newItem.quantite && newItem.observation) {
      const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
      setData([...data, { ...newItem, id: newId, status: 'En stock' }]); // Statut par défaut
      setNewItem({ article: '', quantite: '', observation: '' });
      setShowAddForm(false);
    }
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  // Gestionnaires d'actions factices pour Modifier/Effacer
  const handleModify = (id) => {
    alert(`Modifier l'élément avec l'ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'élément avec l'ID: ${id}?`)) {
      setData(data.filter(item => item.id !== id));
    }
  };

  return (
    <div className="main-content-consommable">
      <div className="content-header">
        <h1>Liste de mes demandes</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <i className="fas fa-plus"></i> Ajouter une demande
        </button>
      </div>

      {/* Controls bar (Afficher X éléments, Article, Filtrer, Réinitialiser, Rechercher) */}
      <div className="controls-bar">
        {/* Groupe de gauche: Afficher X éléments, Article, Filtrer, Réinitialiser */}
        <div className="left-controls-group">
            <div className="entries-selector">
              Afficher
              <select value={entriesPerPage} onChange={handleEntriesPerPageChange}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              éléments
            </div>
            <input
                type="text"
                placeholder="Article"
                value={articleFilter}
                onChange={handleArticleFilterChange}
                className="entries-selector" /* Réutilise le style pour l'input */
            />
            <button className="btn btn-primary" onClick={handleFilterClick}>Filtrer</button>
            <button className="btn btn-secondary" onClick={handleResetFilters}>Réinitialiser</button>
        </div>

        {/* Barre de recherche à droite */}
        <div className="search-bar">
          Rechercher :
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Chargement des données...</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Article <span className="sort-arrow">&#x25B2;&#x25BC;</span></th>
                  <th>Quantité <span className="sort-arrow">&#x25B2;&#x25BC;</span></th>
                  <th>Observation <span className="sort-arrow">&#x25B2;&#x25BC;</span></th>
                  <th>Status <span className="sort-arrow">&#x25B2;&#x25BC;</span></th>
                  <th>Modifier</th>
                  <th>Effacer</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((item) => (
                    <tr key={item.id}>
                      <td>{item.article}</td>
                      <td>{item.quantite}</td>
                      <td>{item.observation}</td>
                      <td>
                        <span
                          style={{
                            backgroundColor: item.status === 'En stock' ? '#d4edda' : '#f8d7da',
                            color: item.status === 'En stock' ? '#155724' : '#721c24',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            fontSize: '0.85em',
                            fontWeight: 'bold',
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleModify(item.id)}
                        >
                          Modifier
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Effacer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      Aucun élément trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="content-footer">
            <div className="entries-info">
              Affichage de l'élément {startIndex + 1} à {Math.min(startIndex + entriesPerPage, filteredData.length)} sur {filteredData.length} éléments
            </div>
            <div className="pagination-controls">
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`btn btn-page ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
            {/* Les boutons d'export PDF/Excel ne sont pas visibles sur imagemiss1.png, donc retirés ici */}
          </div>
        </>
      )}

      {/* Formulaire d'ajout d'un nouvel élément (modale) */}
      {showAddForm && (
        <div className="add-form-container">
          <form onSubmit={handleAddNewItem}>
            <h2>Ajouter une nouvelle demande</h2>
            <div className="form-group">
              <label htmlFor="article">Article</label>
              <input
                type="text"
                id="article"
                name="article"
                value={newItem.article}
                onChange={handleNewItemChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantite">Quantité</label>
              <input
                type="text"
                id="quantite"
                name="quantite"
                value={newItem.quantite}
                onChange={handleNewItemChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="observation">Observation</label>
              <input
                type="text"
                id="observation"
                name="observation"
                value={newItem.observation}
                onChange={handleNewItemChange}
                required
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                Ajouter
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MesDemandesPage;