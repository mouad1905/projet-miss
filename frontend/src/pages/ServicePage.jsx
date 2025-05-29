// frontend/src/pages/ServicePageComponent.jsx (ou où vous placez vos pages)
import React, { useState } from 'react';
// Assurez-vous que le chemin vers votre CSS partagé est correct
import '../css/ConsommableList.css'; // Ou le nom que vous avez choisi

// Optionnel: Icône pour le bouton "Ajouter"
// import { FaPlus } from 'react-icons/fa';

const ServicePageComponent = () => {
  // Données spécifiques pour les services (issues de votre capture d'écran)
  const [data, setData] = useState([
    { id: 1, libelle: 'Service de gestion des ressources financières, du budgets et des marchés', division: "Division de la gestion des ressources et de l'accompagnement de la transformation numérique" },
    { id: 2, libelle: 'Service de gestion des ressources humaines et de renforcement des capacités', division: "Division de la gestion des ressources et de l'accompagnement de la transformation numérique" },
    { id: 3, libelle: 'Service des études, du suivi des travaux et de la logistique', division: "Division de la planification et de la gestion des services publiques et des biens" },
    { id: 4, libelle: "Service d'accès aux services", division: "Division de l'orientation du conseil et des affaires citoyennes" },
    { id: 5, libelle: "Service de l'accompagnement de la transformation numérique et de la gestion des archives", division: "Division de la gestion des ressources et de l'accompagnement de la transformation numérique" },
    { id: 6, libelle: "Service de la communication et de l'administration ouverte", division: "Division de l'orientation du conseil et des affaires citoyennes" },
    { id: 7, libelle: 'Service de la planification et de la gestion urbanisme et des propriétés', division: "Division de la planification et de la gestion des services publiques et des biens" },
  ]);

  // États pour la pagination, la recherche, etc. (simplifié ici)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Vous avez 7 éléments, donc 10 par page les affichera tous
  const [searchTerm, setSearchTerm] = useState('');

  // Logique de filtrage (sur libelle et division) et de pagination
  const filteredData = data.filter(item =>
    item.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.division.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="data-table-view"> {/* Utilisation de la classe principale du CSS partagé */}
      <header className="content-header">
        <h1>Liste des services</h1>
        <button className="btn btn-primary btn-add">
          {/* <FaPlus style={{ marginRight: '8px' }} /> Optionnel: Icône */}
          + Ajouter un service
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
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Libellé <span className="sort-arrow">↕</span></th>
              <th>Division <span className="sort-arrow">↕</span></th> {/* NOUVELLE COLONNE */}
              <th>Modifier <span className="sort-arrow">↕</span></th>
              <th>Effacer <span className="sort-arrow">↕</span></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.libelle}</td>
                  <td>{item.division}</td> {/* NOUVELLE DONNÉE DE COLONNE */}
                  <td><button className="btn btn-success btn-sm">Modifier</button></td>
                  <td><button className="btn btn-danger btn-sm">Effacer</button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Aucun service à afficher.</td> {/* colSpan est maintenant 4 */}
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

export default ServicePageComponent;