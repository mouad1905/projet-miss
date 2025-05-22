import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './component/Sidbar';
import TypesConsommable from './pages/TypesConsommable';
// Ajoute tes autres pages ici

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<div>Accueil</div>} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
            <Route path="/categorie-consommable" element={<TypesConsommable />} />
            {/* Ajoute d'autres routes ici */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
