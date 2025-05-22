import React, { useState } from 'react';
import { FaHome, FaTachometerAlt, FaChevronDown } from 'react-icons/fa';

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const toggleSubMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="w-64 bg-white shadow h-screen p-4">
      <h2 className="text-xl font-bold text-orange-600 mb-6">Municipality Inventory</h2>

      <ul className="space-y-1">
        <li className="flex items-center space-x-2 text-gray-800 hover:text-orange-600 cursor-pointer p-2 rounded hover:bg-orange-100">
          <FaHome />
          <span>Accueil</span>
        </li>

        <li className="flex items-center space-x-2 text-gray-800 hover:text-orange-600 cursor-pointer p-2 rounded hover:bg-orange-100">
          <FaTachometerAlt />
          <span>Tableau de Bord</span>
        </li>

        {/* Menu déroulant Référentiel */}
        <li>
          <div
            onClick={() => toggleSubMenu('referentiel')}
            className="flex items-center justify-between text-gray-800 hover:text-orange-600 cursor-pointer p-2 rounded hover:bg-orange-100"
          >
            <div className="flex items-center space-x-2">
              <span>Référentiel</span>
            </div>
            <FaChevronDown className={`transition-transform ${openMenu === 'referentiel' ? 'rotate-180' : ''}`} />
          </div>
          {openMenu === 'referentiel' && (
            <ul className="ml-6 mt-1 space-y-1 text-sm text-gray-700">
              <li className="hover:text-orange-600 cursor-pointer">Article</li>
              <li className="hover:text-orange-600 cursor-pointer">Bureau</li>
              <li className="hover:text-orange-600 cursor-pointer">Catégorie de fournisseur</li>
              <li className="hover:text-orange-600 cursor-pointer">Division</li>
              <li className="hover:text-orange-600 cursor-pointer">Fournisseur</li>
              <li className="hover:text-orange-600 cursor-pointer">Catégorie d'article</li>
              <li className="text-orange-600 font-semibold cursor-pointer">Catégorie de consommable</li>
              <li className="hover:text-orange-600 cursor-pointer">Catégorie d'employer</li>
              <li className="hover:text-orange-600 cursor-pointer">Service</li>
              <li className="hover:text-orange-600 cursor-pointer">Utilisateur</li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
