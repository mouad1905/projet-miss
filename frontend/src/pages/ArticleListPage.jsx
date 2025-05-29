// frontend/src/pages/ArticleListPageComponent.jsx
import React, { useState } from 'react';
// Assurez-vous que le chemin vers votre CSS partagé est correct
import '../css/ConsommableList.css'; // Ou le nom que vous avez choisi

// Optionnel: Icône pour le bouton "Ajouter"
// import { FaPlus } from 'react-icons/fa';
import { FaFileAlt } from 'react-icons/fa'; // Exemple d'icône pour "Article"

const ArticleListPageComponent = () => {
  // Données d'exemple pour les articles
  const [data, setData] = useState([
    { id: 1, codeArticle: 'ART001', libelle: 'Stylo BIC Cristal Bleu', categorie: 'Fournitures de bureau', unite: 'Pièce' },
    { id: 2, codeArticle: 'ART002', libelle: 'Papier Ramette A4 80g', categorie: 'Fournitures de bureau', unite: 'Ramette' },
    { id: 3, codeArticle: 'ART003', libelle: 'Ordinateur Portable Dell XPS 13', categorie: 'Matériel Informatique', unite: 'Pièce' },
    { id: 4, codeArticle: 'ART004', libelle: 'Clavier USB Logitech K120', categorie: 'Périphériques Informatiques', unite: 'Pièce' },
    { id: 5, codeArticle: 'ART005', libelle: 'Cartouche encre HP 305 Noir', categorie: 'Consommables Informatiques', unite: 'Pièce' },
  ]);

  // États pour la pagination, la recherche, etc.
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Logique de filtrage et de pagination
  const filteredData = data.filter(item =>
    item.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codeArticle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.unite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="data-table-view"> {/* Utilisation de la classe principale du CSS partagé */}
      <header className="content-header">
        <h1>Liste des articles</h1>
        <button className="btn btn-primary btn-add">
          {/* <FaPlus style={{ marginRight: '8px' }} /> Optionnel: Icône */}
          + Ajouter un article
        </button>
      </header>

      <div className="controls-bar">
        <div className="entries-selector">
          Afficher{' '}
          <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
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
              <th>Code Article <span className="sort-arrow">↕</span></th>
              <th>Libellé <span className="sort-arrow">↕</span></th>
              <th>Catégorie <span className="sort-arrow">↕</span></th>
              <th>Unité <span className="sort-arrow">↕</span></th>
              <th>Modifier <span className="sort-arrow">↕</span></th>
              <th>Effacer <span className="sort-arrow">↕</span></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.codeArticle}</td>
                  <td>{item.libelle}</td>
                  <td>{item.categorie}</td>
                  <td>{item.unite}</td>
                  <td><button className="btn btn-success btn-sm">Modifier</button></td>
                  <td><button className="btn btn-danger btn-sm">Effacer</button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>Aucun article à afficher.</td> {/* colSpan est 6 ici */}
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

export default ArticleListPageComponent;