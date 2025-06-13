// frontend/src/component/Sidebar.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import '../css/Sidebar.css';

// Icônes
import {
  FaTachometerAlt, FaBoxOpen, FaCog, FaFileAlt, FaQrcode, FaUsers,
  FaServicestack, FaBuilding, FaTruckMoving, FaUserCircle, FaBell,
  FaClipboardList, FaFolderOpen, FaWarehouse, FaShoppingCart, FaSignOutAlt,
  FaTags, FaCheckSquare, FaTasks
} from 'react-icons/fa';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';

// Pages importées
import TableauDeBordPage from '../pages/TableauDeBordPage';
import TypeEmployeurPageComponent from '../pages/TypeEmployeurPage';
import ServicePageComponent from '../pages/ServicePage';
import CategorieArticlePage from '../pages/CategorieArticlePage';
import FournisseurPage from '../pages/FournisseurPage';
import DivisionPage from '../pages/DivisionPage';
import BureauPageComponent from '../pages/BureauPage';
import ArticleListPage from '../pages/ArticleListPage';
import UserManagementPage from '../pages/GestionUsersPage';
import MesDemandesPageComponent from '../pages/MesDemandes';
import LesDemandesPageComponent from '../pages/LesDemandes';
import LesCommandesPageComponent from '../pages/LesCommandesPage';

// Page temporaire
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '20px' }}>
    <h1>{title}</h1>
    <p>Contenu à venir.</p>
  </div>
);

const SidebarAndContent = ({ onLogout }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');
  const [openSubmenus, setOpenSubmenus] = useState({ referentiel: false });

  const menuItems = useMemo(() => [
    { label: "Acceuil", href: "/acceuil", icon: <FaTachometerAlt /> },
    { label: "Tableau de Bord", href: "/tableau-de-bord", icon: <FaTachometerAlt /> },
    {
      label: "Référentiel",
      icon: <FaCog />,
      href: "#referentiel",
      key: "referentiel",
      subItems: [
        { label: "Article", href: "/referentiel/articles", icon: <FaFileAlt /> },
        { label: "Bureau", href: "/referentiel/bureaux", icon: <FaBuilding /> },
        { label: "Catégorie de fournisseur", href: "/referentiel/categorie-fournisseur", icon: <FaTags /> },
        { label: "Division", href: "/referentiel/divisions", icon: <FaUsers /> },
        { label: "Fournisseur", href: "/referentiel/fournisseurs", icon: <FaTruckMoving /> },
        { label: "Catégorie d'article", href: "/referentiel/categorie-article", icon: <FaBoxOpen /> },
        { label: "Catégorie de consommable", href: "/referentiel/categorie-consommable", icon: <FaTags /> },
        { label: "Catégorie d'employer", href: "/referentiel/type-employeur", icon: <FaUsers /> },
        { label: "Service", href: "/referentiel/services", icon: <FaServicestack /> },
        { label: "Utilisateur", href: "/referentiel/utilisateur", icon: <FaUserCircle /> },
      ],
    },
    { label: "Génération QR", href: "/generation-qr", icon: <FaQrcode /> },
    { label: "Mes Demandes", href: "/mes-demandes", icon: <FaClipboardList /> },
    { label: "Les Demandes", href: "/les-demandes", icon: <FaFolderOpen /> },
    { label: "Les Commandes", href: "/les-commandes", icon: <FaShoppingCart /> },
    { label: "Mes Commandes livré", href: "/mes-commandes-livres", icon: <FaCheckSquare /> },
    { label: "Les Commandes livrés", href: "/les-commandes-livres", icon: <FaTasks /> },
  ], []);

  useEffect(() => {
    const pathname = location.pathname;
    let currentLabel = "";

    for (const item of menuItems) {
      if (item.href === pathname) {
        currentLabel = item.label;
        break;
      }
      if (item.subItems) {
        const subItemMatch = item.subItems.find(sub => sub.href === pathname);
        if (subItemMatch) {
          currentLabel = subItemMatch.label;
          break;
        }
      }
    }

    setActiveItem(currentLabel);

    const parentOfActive = menuItems.find(item =>
      item.subItems?.some(sub => sub.label === currentLabel)
    );
    if (parentOfActive) {
      setOpenSubmenus(prev => ({ ...prev, [parentOfActive.key]: true }));
    }
  }, [location.pathname, menuItems]);

  const handleToggleSubmenu = (e, key) => {
    e.preventDefault();
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="sidebar">
        <div className="sidebar-header">Municipality Inventory</div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.label}
                className={`${item.subItems ? 'has-submenu' : ''} ${activeItem === item.label || (item.subItems && item.subItems.some(sub => sub.label === activeItem)) ? 'active-parent' : ''}`}
              >
                <Link
                  to={item.href}
                  onClick={item.subItems ? (e) => handleToggleSubmenu(e, item.key) : undefined}
                  className={activeItem === item.label ? 'active' : ''}
                >
                  {item.icon && <span className="sidebar-icon-wrapper">{item.icon}</span>}
                  <span>{item.label}</span>
                  {item.subItems && (
                    openSubmenus[item.key]
                      ? <MdKeyboardArrowDown className="chevron-icon" />
                      : <MdKeyboardArrowRight className="chevron-icon" />
                  )}
                </Link>
                {item.subItems && openSubmenus[item.key] && (
                  <ul className="submenu">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.label} className={activeItem === subItem.label ? 'active' : ''}>
                        <Link to={subItem.href}>
                          {subItem.icon && <span className="sidebar-icon-wrapper submenu-icon-wrapper">{subItem.icon}</span>}
                          <span>{subItem.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-user-profile">
          <FaUserCircle size={24} className="user-actions-icon" />
          <div className="notification-area">
            <FaBell size={24} className="user-actions-icon" />
            <span className="notification-badge">1</span>
          </div>
          {onLogout && (
            <button onClick={onLogout} title="Déconnexion" className="logout-button">
              <FaSignOutAlt size={22} />
            </button>
          )}
        </div>
      </aside>

      <main style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f0f2f5', marginLeft: '260px' }}>
        <Routes>
          <Route path="/tableau-de-bord" element={<TableauDeBordPage />} />
          <Route path="/acceuil" element={<TableauDeBordPage />} />

          {/* Référentiel */}
          <Route path="/referentiel/articles" element={<ArticleListPage />} />
          <Route path="/referentiel/bureaux" element={<BureauPageComponent />} />
          <Route path="/referentiel/divisions" element={<DivisionPage />} />
          <Route path="/referentiel/fournisseurs" element={<FournisseurPage />} />
          <Route path="/referentiel/categorie-article" element={<CategorieArticlePage />} />
          <Route path="/referentiel/type-employeur" element={<TypeEmployeurPageComponent />} />
          <Route path="/referentiel/services" element={<ServicePageComponent />} />
          <Route path="/referentiel/utilisateur" element={<UserManagementPage />} />
          <Route path="/referentiel/categorie-fournisseur" element={<PlaceholderPage title="Catégorie de Fournisseur" />} />
          <Route path="/referentiel/categorie-consommable" element={<PlaceholderPage title="Catégorie de Consommable" />} />

          {/* Autres pages */}
          <Route path="/generation-qr" element={<PlaceholderPage title="Génération QR" />} />
          <Route path="/mes-demandes" element={<MesDemandesPageComponent />} />
          <Route path="/les-demandes" element={<LesDemandesPageComponent />} />
          <Route path="/les-commandes" element={<LesCommandesPageComponent />} />
          <Route path="/mes-commandes-livres" element={<PlaceholderPage title="Mes Commandes livrés" />} />
          <Route path="/les-commandes-livres" element={<PlaceholderPage title="Les Commandes livrés" />} />

          {/* Redirection */}
          <Route path="/" element={<Navigate to="/tableau-de-bord" replace />} />
          <Route path="*" element={<PlaceholderPage title="404 - Page non trouvée" />} />
        </Routes>
      </main>
    </div>
  );
};

export default SidebarAndContent;
