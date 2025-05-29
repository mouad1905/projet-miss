// frontend/src/pages/CategorieArticlePageComponent.jsx (ou où vous placez vos pages)
import React, { useState } from 'react';
// Assurez-vous que le chemin vers votre CSS partagé est correct
import '../css/ConsommableList.css'; // Ou le nom que vous avez choisi

// Optionnel: Icône pour le bouton "Ajouter"
// import { FaPlus } from 'react-icons/fa';

const CategorieArticlePageComponent = () => {
  // Données spécifiques pour les catégories d'articles (issues de votre capture d'écran)
  const [data, setData] = useState([
    { id: 1, libelle: 'Fax' },
    { id: 2, libelle: 'Informatique' },
    { id: 3, libelle: 'Ecran' },
    { id: 4, libelle: 'electronique' }, // Attention à la casse si 'électronique' est souhaité
  ]);

  // États pour la pagination, la recherche, etc.
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Logique de filtrage et de pagination
  const filteredData = data.filter(item =>
    item.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="data-table-view"> {/* Utilisation de la classe principale du CSS partagé */}
      <header className="content-header">
        <h1>Liste des catégories des articles</h1>
        <button className="btn btn-primary btn-add">
          {/* <FaPlus style={{ marginRight: '8px' }} /> Optionnel: Icône */}
          + Ajouter une catégorie d'article
        </button>
      </header>

      <div className="controls-bar">
        <div className="entries-selector">
          Afficher{' '}
          <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>{' '}
          éléments
        </div>
        <div className="search-bar">
          Rechercher: <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
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
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.libelle}</td>
                  <td><button className="btn btn-success btn-sm">Modifier</button></td>
                  <td><button className="btn btn-danger btn-sm">Effacer</button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>Aucune catégorie d'article à afficher.</td> {/* colSpan est 3 ici */}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="content-footer-bar">
        <div className="pagination-info">
          Affichage de l'élément {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} à {Math.min(indexOfLastItem, filteredData.length)} sur {filteredData.length} éléments
        </div>
        <div className="pagination-controls">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          {[...Array(totalPages).keys()].map(number => (
             <button
                key={number + 1}
                className={`btn btn-page btn-sm ${currentPage === number + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(number + 1)}
             >
                {number + 1}
             </button>
          ))}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Suivant
          </button>
        </div>
        <div className="export-buttons">
          <button className="btn btn-secondary btn-sm">Export PDF</button>
          <button className="btn btn-secondary btn-sm">Export Excel</button>
        </div>
      </footer>
    </div>
  );
};

export default CategorieArticlePageComponent;