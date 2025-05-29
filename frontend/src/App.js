// frontend/src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
// Dans frontend/src/App.js
import SidebarAndContent from './component/Sidbar'; // Utilisez 'Sidbar'
import './App.css'; // Vos styles globaux si nécessaire

function App() {
  return (
    <BrowserRouter>
      <SidebarAndContent />
    </BrowserRouter>
  );
}

export default App;