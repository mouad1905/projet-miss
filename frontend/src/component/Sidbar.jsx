// SidebarComponent.jsx
import React, { useState } from 'react';
// import '../css/Sidebar'; // CSS dédié pour la barre latérale

// Icônes de remplacement (vous utiliseriez probablement une bibliothèque d'icônes)
const DashboardIcon = () => <span className="sidebar-icon">&#128200;</span>;
const SettingsIcon = () => <span className="sidebar-icon">&#9881;</span>;
const ArticleIcon = () => <span className="sidebar-icon">&#128220;</span>;
const BuildingIcon = () => <span className="sidebar-icon">&#127970;</span>;
const CategoryIcon = () => <span className="sidebar-icon">&#128193;</span>;
const DivisionIcon = () => <span className="sidebar-icon">&#128203;</span>;
const SupplierIcon = () => <span className="sidebar-icon">&#128736;</span>;
const InventoryIcon = () => <span className="sidebar-icon">&#128230;</span>;
const QRIcon = () => <span className="sidebar-icon">&#128240;</span>;
const UserIcon = () => <span className="sidebar-icon user-actions-icon">&#128100;</span>;
const BellIcon = () => <span className="sidebar-icon user-actions-icon">&#128276;</span>;
const ChevronDownIcon = () => <span className="chevron-icon">&#9660;</span>; // Bas
const ChevronRightIcon = () => <span className="chevron-icon">&#9654;</span>; // Droite

const Sidebar = ({ activeItem = "Catégorie de consommable" }) => {
  const [referentielOpen, setReferentielOpen] = useState(true); // Par défaut ouvert si un enfant est actif

  // Déterminer si un enfant de "Référentiel" est actif
  const isReferentielChildActive = [
    "Article", "Bureau", "Catégorie de fournisseur", "Division",
    "Fournisseur", "Catégorie d'article", "Catégorie de consommable",
    "Catégorie d'employer", "Service", "Utilisateur"
  ].includes(activeItem);

  useState(() => {
    setReferentielOpen(isReferentielChildActive);
  }, [isReferentielChildActive]);


  const menuItems = [
    { label: "Tableau de Bord", icon: <DashboardIcon />, href: "#tableau-de-bord" },
    {
      label: "Référentiel",
      icon: <SettingsIcon />,
      href: "#referentiel",
      isOpen: referentielOpen,
      setOpen: setReferentielOpen,
      subItems: [
        { label: "Article", icon: <ArticleIcon />, href: "#article" },
        { label: "Bureau", icon: <BuildingIcon />, href: "#bureau" },
        { label: "Catégorie de fournisseur", icon: <CategoryIcon />, href: "#cat-fournisseur" },
        { label: "Division", icon: <DivisionIcon />, href: "#division" },
        { label: "Fournisseur", icon: <SupplierIcon />, href: "#fournisseur" },
        { label: "Catégorie d'article", icon: <CategoryIcon />, href: "#cat-article" },
        { label: "Catégorie de consommable", icon: <CategoryIcon />, href: "#cat-consommable" },
        { label: "Catégorie d'employer", icon: <CategoryIcon />, href: "#cat-employer" },
        { label: "Service", icon: <SettingsIcon />, href: "#service" }, // Placeholder icon
        { label: "Utilisateur", icon: <UserIcon />, href: "#utilisateur" }, // Placeholder icon
      ],
    },
    { label: "Inventaire", icon: <InventoryIcon />, href: "#inventaire" },
    { label: "Génération QR", icon: <QRIcon />, href: "#generation-qr" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        Municipality Inventory
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`${item.subItems ? 'has-submenu' : ''} ${activeItem === item.label || (item.subItems && item.subItems.some(sub => sub.label === activeItem)) ? 'active-parent' : ''}`}
            >
              <a
                href={item.href}
                onClick={(e) => {
                  if (item.subItems) {
                    e.preventDefault();
                    item.setOpen(!item.isOpen);
                  }
                }}
                className={activeItem === item.label ? 'active' : ''}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.subItems && (item.isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />)}
              </a>
              {item.subItems && item.isOpen && (
                <ul className="submenu">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className={activeItem === subItem.label ? 'active' : ''}>
                      <a href={subItem.href}>
                        {subItem.icon && React.cloneElement(subItem.icon, { className: 'sidebar-icon submenu-icon' })}
                        <span>{subItem.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-user-profile">
        <UserIcon />
        <div className="notification-area">
          <BellIcon />
          <span className="notification-badge">1</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;