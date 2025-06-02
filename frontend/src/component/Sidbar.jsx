// frontend/src/component/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import '../css/Sidebar.css'; // Assurez-vous que le chemin est correct

// Importez vos composants de page ici
import TableauDeBordPage from '../pages/TableauDeBordPage';
import CategorieConsommablePage from '../pages/CategorieConsommablePage';
import TypeEmployeurPage from '../pages/TypeEmployeurPage';
import ServicePageComponent from '../pages/ServicePage';
import CategorieArticlePage from '../pages/CategorieArticlePage';
import FournisseurPage from '../pages/FournisseurPage';
import DivisionPage from '../pages/DivisionPage';
import CategorieFournisseurPage from '../pages/CategorieFournisseurPage';
import BureauPage from '../pages/BureauPage';
import ArticleListPage from '../pages/ArticleListPage';
import InventairePage from '../pages/InventairePage';
// Importez d'autres pages si nécessaire

// Importez des icônes (exemple avec React Icons - voir section suivante)
import { FaTachometerAlt, FaBoxOpen, FaTags, FaCog, FaFileAlt, FaQrcode, FaUsers, FaServicestack, FaBuilding, FaTruckMoving, FaUserCircle, FaBell } from 'react-icons/fa'; // Font Awesome
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md'; // Material Design pour les chevrons
import UserManagementPage from '../pages/GestionUsersPage';

// Vos composants de page (s'ils sont très simples, sinon gardez-les dans /pages)
// const PlaceholderPage = ({ title }) => <div style={{ padding: '20px' }}><h1>{title}</h1><p>Contenu de la page {title}.</p></div>;

const SidebarAndContent = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [referentielOpen, setReferentielOpen] = useState(false);

  useEffect(() => {
    const pathname = location.pathname;
    // Logique pour déterminer activeItem et si referentielOpen doit être vrai
    // (Adaptée de App.js/AppLayout)
    let currentLabel = "";
    const referentielSubItemsLabels = [
      "Article", "Bureau", "Catégorie de fournisseur", "Division",
      "Fournisseur", "Catégorie d'article", "Catégorie de consommable",
      "Catégorie d'employer", "Service", "Utilisateur"
    ];

    if (pathname === '/tableau-de-bord' || pathname === '/') currentLabel = "Tableau de Bord";
    else if (pathname.startsWith('/referentiel')) {
      if (pathname === '/referentiel/categorie-consommable') currentLabel = "Catégorie de consommable";
      else if (pathname === '/referentiel/article') currentLabel = "Article";
      // ... autres sous-routes de référentiel
      else currentLabel = "Référentiel"; // Cas où on est sur /referentiel (si c'est une page)
      
      // Trouver le label exact si c'est un sous-item pour l'état actif
      const subItemMatch = menuItems.find(item => item.label === "Référentiel")
                                  ?.subItems?.find(sub => sub.href === pathname);
      if (subItemMatch) currentLabel = subItemMatch.label;

    } else if (pathname === '/inventaire') currentLabel = "Inventaire";
    else if (pathname === '/generation-qr') currentLabel = "Génération QR";
    // ... ajoutez d'autres routes principales

    setActiveItem(currentLabel);
    setReferentielOpen(referentielSubItemsLabels.includes(currentLabel) || currentLabel === "Référentiel");

  }, [location.pathname]);

  // Définition des items du menu avec les icônes
  const menuItems = [
    { label: "Tableau de Bord", href: "/tableau-de-bord", icon: <FaTachometerAlt /> },
    {
      label: "Référentiel",
      icon: <FaCog />,
      href: "#referentiel", // Pas de navigation directe si c'est juste un groupeur
      isParent: true,
      subItems: [
        { label: "Article", href: "/referentiel/articles", icon: <FaFileAlt /> },
        { label: "Bureau", href: "/referentiel/bureaux", icon: <FaBuilding /> },
        { label: "Catégorie de fournisseur", href: "/referentiel/categorie-fournisseur", icon: <FaTags /> },
        { label: "Division", href: "/referentiel/divisions", icon: <FaUsers /> }, // Exemple
        { label: "Fournisseur", href: "/referentiel/fournisseurs", icon: <FaTruckMoving /> },
        { label: "Catégorie d'article", href: "/referentiel/categorie-article", icon: <FaBoxOpen /> },
        { label: "Catégorie de consommable", href: "/referentiel/categorie-consommable", icon: <FaTags /> }, // Répété, ajustez
        { label: "Catégorie d'employer", href: "/referentiel/categorie-employer", icon: <FaUsers /> },
        { label: "Service", href: "referentiel/services", icon: <FaServicestack /> },
        { label: "Utilisateur", href: "/referentiel/utilisateur", icon: <FaUserCircle /> },
      ],
    },
    { label: "Inventaire", href: "/inventaire", icon: <FaBoxOpen /> },
    { label: "Génération QR", href: "/generation-qr", icon: <FaQrcode /> },
  ];


  const handleToggleReferentiel = (e) => {
    // Empêcher la navigation si le lien principal du référentiel est cliqué et qu'il n'a pas de page propre
    if (e.currentTarget.getAttribute('href') === '#referentiel') {
        e.preventDefault();
    }
    setReferentielOpen(!referentielOpen);
  };


  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="sidebar">
        <div className="sidebar-header">
          Municipality Inventory
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.label}
                className={`
                  ${item.subItems ? 'has-submenu' : ''}
                  ${activeItem === item.label || (item.subItems && item.subItems.some(sub => sub.label === activeItem)) ? 'active-parent' : ''}
                `}
              >
                <Link
                  to={item.href}
                  onClick={item.label === "Référentiel" ? handleToggleReferentiel : undefined}
                  className={activeItem === item.label && !item.subItems ? 'active' : ''}
                >
                  {item.icon && <span className="sidebar-icon-wrapper">{item.icon}</span>}
                  <span>{item.label}</span>
                  {item.subItems && (referentielOpen ? <MdKeyboardArrowDown className="chevron-icon" /> : <MdKeyboardArrowRight className="chevron-icon" />)}
                </Link>
                {item.label === "Référentiel" && item.subItems && referentielOpen && (
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
        </div>
      </aside>

      <main 
        style={{ 
          flexGrow: 1, 
          padding: '20px', 
          backgroundColor: '#f0f2f5',
          marginLeft: '260px' /* AJOUTEZ CECI ! (doit correspondre à la largeur de .sidebar) */
        }}
      >
        <Routes>
          <Route path="/tableau-de-bord" element={<TableauDeBordPage />} />
          <Route path="/referentiel/categorie-consommable" element={<CategorieConsommablePage />} />
          <Route path="/referentiel/articles" element={<ArticleListPage />} />
          <Route path="/referentiel/categorie-employer" element={<TypeEmployeurPage />} />
          <Route path="/referentiel/services" element={<ServicePageComponent />} />
          <Route path="/referentiel/categorie-article" element={<CategorieArticlePage />} />
          <Route path="/referentiel/fournisseurs" element={<FournisseurPage />} />
          <Route path="/referentiel/divisions" element={<DivisionPage />} />
          <Route path="/referentiel/categorie-fournisseur" element={<CategorieFournisseurPage />} /> 
          <Route path="/referentiel/bureaux" element={<BureauPage />} />
          <Route path="/referentiel/utilisateur" element={<UserManagementPage />} />
          <Route path="/inventaire" element={<InventairePage />} /> 
          {/* Ajoutez les Routes pour les autres pages de référentiel et principales */}
          {/* Exemple : <Route path="/referentiel/bureau" element={<PlaceholderPage title="Bureau" />} /> */}
          {/* Route par défaut */}
          <Route path="/" element={<TableauDeBordPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default SidebarAndContent; // Notez que ce composant gère maintenant tout