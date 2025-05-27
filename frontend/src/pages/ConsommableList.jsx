// ConsommableListComponent.jsx
import React from 'react';
import '../ConsommableList'; // We'll create this CSS file next

// Placeholder icons (you might use an icon library like Font Awesome or Material Icons)
const UserIcon = () => <span className="icon">&#128100;</span>; // Example User Icon
const BellIcon = () => <span className="icon">&#128276;</span>; // Example Bell Icon
const SettingsIcon = () => <span className="icon">&#9881;</span>; // Example Settings Icon
const DashboardIcon = () => <span className="icon">&#128200;</span>; // Example Dashboard Icon
const ArticleIcon = () => <span className="icon">&#128220;</span>; // Example Article Icon
const BuildingIcon = () => <span className="icon">&#127970;</span>; // Example Building Icon
const CategoryIcon = () => <span className="icon">&#128193;</span>; // Example Category Icon
const DivisionIcon = () => <span className="icon">&#128203;</span>; // Example Division Icon
const SupplierIcon = () => <span className="icon">&#128736;</span>; // Example Supplier Icon
const InventoryIcon = () => <span className="icon">&#128230;</span>; // Example Inventory Icon
const QRIcon = () => <span className="icon">&#128240;</span>; // Example QR Icon

const ConsommableList = () => {
  const data = [
    { id: 1, libelle: 'consommable' },
    { id: 2, libelle: 'non consommable' },
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          Municipality Inventory
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="#"><DashboardIcon /> Tableau de Bord</a></li>
            <li className="active-parent">
              <a href="#"> <SettingsIcon /> Référentiel</a>
              <ul className="submenu">
                <li><a href="#"><ArticleIcon /> Article</a></li>
                <li><a href="#"><BuildingIcon /> Bureau</a></li>
                <li><a href="#"><CategoryIcon /> Catégorie de fournisseur</a></li>
                <li><a href="#"><DivisionIcon /> Division</a></li>
                <li><a href="#"><SupplierIcon /> Fournisseur</a></li>
                <li><a href="#">Catégorie d'article</a></li>
                <li className="active"><a href="#">Catégorie de consommable</a></li>
                <li><a href="#">Catégorie d'employer</a></li>
                <li><a href="#">Service</a></li>
                <li><a href="#">Utilisateur</a></li>
              </ul>
            </li>
            <li><a href="#"><InventoryIcon /> Inventaire</a></li>
            <li><a href="#"><QRIcon /> Génération QR</a></li>
          </ul>
        </nav>
        <div className="sidebar-user-profile">
          <UserIcon />
          <BellIcon /> <span className="notification-badge">1</span>
        </div>
      </aside>

      <main className="main-content">
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
            Rechercher: <input type="text" />
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
            </tbody>
          </table>
        </div>

        <footer className="content-footer">
          <div className="pagination-info">
            Affichage de l'élément 1 à 2 sur 2 éléments
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
    </div>
  );
};

export default ConsommableList;