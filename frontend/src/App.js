// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Importation des composants et CSS globaux
import './App.css'; // Styles globaux pour App
import SidebarComponent from './component/Sidbar'; // ou Sidebar.jsx si vous renommez
// import ConsommableTableComponent from './component/ConsommableList'; // Si c'est une page

// Importation des composants de "page" depuis votre dossier pages
// Supposons que vous avez des pages comme celles-ci :
import TableauDeBordPage from './pages/TableauDeBordPage';
import CategorieConsommablePage from './pages/CategorieConsommablePage';
import ArticlePage from './pages/ArticlePage';
import './css/Sidebar.css'
import './css/ConsommableList.css'
// ... autres pages

const AppLayout = () => {
  const location = useLocation();
  let currentNavItem = "";
  const pathname = location.pathname;

  // Votre logique pour déterminer currentNavItem en fonction de pathname
  // (comme dans l'exemple précédent)
  // Par exemple:
  if (pathname === '/tableau-de-bord') currentNavItem = "Tableau de Bord";
  else if (pathname === '/referentiel/categorie-consommable') currentNavItem = "Catégorie de consommable";
  else if (pathname === '/referentiel/article') currentNavItem = "Article";
  // ...etc.

  return (
    <div style={{ display: 'flex' }}>
      <SidebarComponent activeItem={currentNavItem} />
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/tableau-de-bord" element={<TableauDeBordPage />} />
          <Route path="/referentiel/categorie-consommable" element={<CategorieConsommablePage />} />
          <Route path="/referentiel/article" element={<ArticlePage />} />
          {/* Route par défaut */}
          <Route path="/" element={<TableauDeBordPage />} />
          {/* Ajoutez d'autres routes ici */}
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;