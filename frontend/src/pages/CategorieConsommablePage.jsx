// frontend/src/pages/CategorieConsommablePage.jsx
import React from 'react';
// Si vous prévoyez d'afficher la table des consommables ici :
// import ConsommableTableComponent from '../component/ConsommableList'; // Ajustez le chemin si nécessaire

function CategorieConsommablePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Page Catégorie de Consommable</h1>
      <p>C'est ici que vous afficherez le contenu spécifique à la gestion des catégories de consommables.</p>
      {/*
        Si vous voulez inclure le composant de la table directement ici,
        vous pouvez décommenter la ligne d'import ci-dessus et faire :
        <ConsommableTableComponent />
        Sinon, ce composant de page pourrait avoir sa propre logique et son propre affichage.
      */}
    </div>
  );
}

export default CategorieConsommablePage;