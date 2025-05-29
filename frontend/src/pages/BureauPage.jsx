// frontend/src/pages/BureauPageComponent.jsx
import React, { useState } from 'react';
// Assurez-vous que le chemin vers votre CSS partagé est correct
import '../css/ConsommableList.css'; // Ou le nom que vous avez choisi

// Optionnel: Icône pour le bouton "Ajouter"
// import { FaPlus } from 'react-icons/fa';
// Vous pourriez aussi vouloir une icône spécifique pour les bureaux
import { FaBuilding } from 'react-icons/fa'; // Exemple

const BureauPageComponent = () => {
  // Données d'exemple pour les bureaux (issues de votre capture d'écran)
  const [data, setData] = useState([
    { id: 1, libelle: 'Bureau de maintenance et de gestion du matériel et des équipement', abreviation: 'BMGME', service: 'Service des études, du suivi des travaux et de la logistique' },
    { id: 2, libelle: 'Bureau de gestion des affaires du personnel', abreviation: 'BGAP', service: 'Service de gestion des ressources humaines et de renforcement des capacités' },
    { id: 3, libelle: 'Bureau de certification des signatures et de la conformité des copies aux originaux et ses annexes', abreviation: 'BCSGCODAAA', service: "Service d'accès aux services" },
    { id: 4, libelle: "Bureau d'accueil, d'orientation et suivi des usagers", abreviation: 'BAOSU', service: "Service de la communication et de l'administration ouverte" },
    { id: 5, libelle: 'bureau de gestion déléguée et de suivi des sociétés de développement et des services publiques locaux', abreviation: 'BGSSDSPL', service: 'Service de la planification et de la gestion urbanisme et des propriétés' },
    { id: 6, libelle: 'Bureau des paiements', abreviation: 'BP', service: "Service d'accès aux services" },
    { id: 7, libelle: "Bureau d'urbanisme, de construction et d'aménagement du territoire", abreviation: 'BUCAT', service: 'Service de la planification et de la gestion urbanisme et des propriétés' },
    { id: 8, libelle: "Bureau des espaces verts et de l'éclairage public", abreviation: 'BEVEP', service: 'Service des études, du suivi des travaux et de la logistique' },
    { id: 9, libelle: "Bureau des systèmes d'information géographique et de gestion intégrée", abreviation: 'BSISGGI', service: "Service de l'accompagnement de la transformation numérique et de la gestion des archives" },
    { id: 10, libelle: 'bureau de la planification, de la préparation des partenariats et du suivi des programme de développement', abreviation: 'BPPPSD', service: 'Service de la planification et de la gestion urbanisme et des propriétés' },
    // La capture montre 24 éléments au total, ajoutez les autres si besoin pour un test complet
  ]);

  // États pour la pagination, la recherche, etc.
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Logique de filtrage et de pagination (recherche sur libelle, abreviation, service)
  const filteredData = data.filter(item =>
    item.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.abreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // La capture montre 24 éléments au total, pour la pagination correcte,
  // utilisez filteredData.length qui correspondra au nombre total d'éléments après filtrage.
  // Si vous voulez simuler les 24 éléments sans les ajouter tous à `data` :
  // const totalItemsFromDB = 24; // Simule le total
  // const totalPages = Math.ceil(totalItemsFromDB / itemsPerPage);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);


  return (
    <div className="data-table-view"> {/* Utilisation de la classe principale du CSS partagé */}
      <header className="content-header">
        <h1>Liste des bureaux</h1>
        <button className="btn btn-primary btn-add">
          {/* <FaPlus style={{ marginRight: '8px' }} /> Optionnel: Icône */}
          + Ajouter un bureau
        </button>
      </header>

      <div className="controls-bar">
        <div className="entries-selector">
          Afficher{' '}
          <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
            <option value="10">10</option>
            <option value="25">25</option> {/* Adaptez si vous avez moins de 25 éléments */}
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
              <th>Libellé <span className="sort-arrow">↕</span></th>
              <th>Abréviation <span className="sort-arrow">↕</span></th>
              <th>Service <span className="sort-arrow">↕</span></th>
              <th>Modifier <span className="sort-arrow">↕</span></th>
              <th>Effacer <span className="sort-arrow">↕</span></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.libelle}</td>
                  <td>{item.abreviation}</td>
                  <td>{item.service}</td>
                  <td><button className="btn btn-success btn-sm">Modifier</button></td>
                  <td><button className="btn btn-danger btn-sm">Effacer</button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>Aucun bureau à afficher.</td> {/* colSpan est 5 ici */}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="content-footer-bar">
        <div className="pagination-info">
          {/* La capture montre "Affichage de l'élément 1 à 10 sur 24 éléments" */}
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
          {/* Génération dynamique des numéros de page */}
          {/* La capture montre les pages 1, 2, 3. Adaptez la logique si nécessaire pour un grand nombre de pages. */}
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

export default BureauPageComponent;