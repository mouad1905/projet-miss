// App.js ou un composant de layout
import React from 'react';
import SidebarComponent from './component/Sidbar';
import './css/Sidebar.css';
import './css/ConsommableList.css' // Ajustez le chemin si nécessaire
// import MainContentComponent from './MainContentComponent'; // Votre composant de contenu principal

function App() {
  // Vous pouvez passer la prop `activeItem` dynamiquement en fonction de la route actuelle
  const currentRouteName = "Catégorie de consommable"; // Exemple

  return (
    <div style={{ display: 'flex' }}>
      <SidebarComponent activeItem={currentRouteName} />
      <main style={{ marginLeft: '260px', flexGrow: 1, padding: '20px' }}>
        {/* <MainContentComponent /> */}
        {/* Le reste de votre application ici */}
        Contenu principal de la page...
      </main>
    </div>
  );
}

export default App;