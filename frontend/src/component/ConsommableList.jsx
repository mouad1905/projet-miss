// ConsommableTableComponent.jsx
import React from 'react';
 // Nous créerons ce fichier CSS ensuite

const ConsommableTableComponent = () => {
  const data = [
    { id: 1, libelle: 'consommable' },
    { id: 2, libelle: 'non consommable' },
    // Ajoutez d'autres données si nécessaire
  ];

  // Vous géreriez la pagination, la recherche, etc., avec l'état (useState)
  // et des gestionnaires d'événements dans une application réelle.

  return (
    <main className="main-content-consommable">
      <header className="content-header">
        <h1>Liste des types de consommable</h1>
        <button className="btn btn-primary">+ Ajouter un type de consommable</button>
      </header>

      <div className="controls-bar">
        <div className="entries-selector">
          Afficher{' '}
          <select>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>{' '}
          éléments
        </div>
        <div className="search-bar">
          Rechercher: <input type="text" placeholder="Rechercher..." />
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
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.libelle}</td>
                <td><button className="btn btn-success">Modifier</button></td>
                <td><button className="btn btn-danger">Effacer</button></td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>Aucun élément à afficher</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="content-footer">
        <div className="pagination-info">
          Affichage de l'élément 1 à {data.length} sur {data.length} éléments
        </div>
        <div className="pagination-controls">
          <button className="btn btn-secondary" disabled>Précédent</button>
          <button className="btn btn-page active">1</button>
          <button className="btn btn-secondary">Suivant</button>
        </div>
        <div className="export-buttons">
          <button className="btn btn-secondary">Export PDF</button>
          <button className="btn btn-secondary">Export Excel</button>
        </div>
      </footer>
    </main>
  );
};

export default ConsommableTableComponent;