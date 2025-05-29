// frontend/src/pages/InventairePageComponent.jsx
import React, { useState } from 'react';
// Assurez-vous que le chemin vers votre CSS partagé est correct
import '../css/ConsommableList.css'; // Ou le nom que vous avez choisi

// Optionnel: Icône pour le bouton "Ajouter"
// import { FaPlus } from 'react-icons/fa';
import { FaBoxOpen } from 'react-icons/fa'; // Exemple d'icône pour "Inventaire"

const InventairePageComponent = () => {
  // Données d'exemple pour l'inventaire
  const [data, setData] = useState([
    { id: 1, numInventaire: 'INV001', designation: 'Ordinateur Portable XPS 15', categorie: 'Matériel Informatique', bureau: 'Bureau de Direction', quantite: 1, dateAcquisition: '2023-05-15' },
    { id: 2, numInventaire: 'INV002', designation: 'Imprimante Laser Multifonction', categorie: 'Matériel Informatique', bureau: 'Secrétariat Général', quantite: 1, dateAcquisition: '2022-11-20' },
    { id: 3, numInventaire: 'INV003', designation: 'Chaise de Bureau Ergonomique', categorie: 'Mobilier de Bureau', bureau: 'Bureau de Direction', quantite: 1, dateAcquisition: '2023-01-10' },
    { id: 4, numInventaire: 'INV004', designation: 'Table de Réunion', categorie: 'Mobilier de Bureau', bureau: 'Salle de Réunion A', quantite: 1, dateAcquisition: '2022-09-05' },
    { id: 5, numInventaire: 'INV005', designation: 'Projecteur Vidéo Epson', categorie: 'Matériel Audiovisuel', bureau: 'Salle de Réunion A', quantite: 1, dateAcquisition: '2023-03-22' },
  ]);

  // États pour la pagination, la recherche, etc.
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Logique de filtrage et de pagination
  const filteredData = data.filter(item =>
    item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numInventaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.bureau.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="data-table-view"> {/* Utilisation de la classe principale du CSS partagé */}
      <header className="content-header">
        <h1>Liste d'inventaire</h1>
        <button className="btn btn-primary btn-add">
          {/* <FaPlus style={{ marginRight: '8px' }} /> Optionnel: Icône */}
          + Ajouter à l'inventaire
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
              <th>N° d'inventaire <span className="sort-arrow">↕</span></th>
              <th>Désignation <span className="sort-arrow">↕</span></th>
              <th>Catégorie <span className="sort-arrow">↕</span></th>
              <th>Bureau/Emplacement <span className="sort-arrow">↕</span></th>
              <th>Qté <span className="sort-arrow">↕</span></th>
              <th>Date d'acquisition <span className="sort-arrow">↕</span></th>
              <th>Modifier <span className="sort-arrow">↕</span></th>
              <th>Effacer <span className="sort-arrow">↕</span></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.numInventaire}</td>
                  <td>{item.designation}</td>
                  <td>{item.categorie}</td>
                  <td>{item.bureau}</td>
                  <td>{item.quantite}</td>
                  <td>{item.dateAcquisition}</td>
                  <td><button className="btn btn-success btn-sm">Modifier</button></td>
                  <td><button className="btn btn-danger btn-sm">Effacer</button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>Aucun élément d'inventaire à afficher.</td> {/* colSpan est 8 ici */}
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

export default InventairePageComponent;