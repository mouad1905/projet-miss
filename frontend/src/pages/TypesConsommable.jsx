// src/pages/TypesConsommable.js
import React, { useState } from 'react';

const TypesConsommable = () => {
  const [types, setTypes] = useState([
    { id: 1, libelle: 'consomable' },
    { id: 2, libelle: 'non consomable' }
  ]);
  const [search, setSearch] = useState('');

  const handleDelete = (id) => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cet élément ?");
    if (confirmed) {
      setTypes(types.filter(type => type.id !== id));
    }
  };

  const filteredTypes = types.filter(type =>
    type.libelle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Liste des types de consommable</h1>

      <div className="flex justify-between items-center mb-4">
        <button className="bg-orange-600 text-white px-4 py-2 rounded shadow hover:bg-orange-700">
          + Ajouter un type de consommable
        </button>

        <input
          type="text"
          placeholder="Rechercher..."
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto border rounded bg-white shadow">
        <table className="min-w-full text-center">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">Libellé</th>
              <th className="px-4 py-3">Modifier</th>
              <th className="px-4 py-3">Effacer</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {filteredTypes.map(type => (
              <tr key={type.id} className="border-t">
                <td className="px-4 py-2">{type.libelle}</td>
                <td>
                  <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                    Modifier
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(type.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Effacer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4 items-center">
        <p className="text-sm text-gray-600">
          Affichage de l'élément 1 à {filteredTypes.length} sur {types.length} éléments
        </p>

        <div className="space-x-2">
          <button className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600">
            Export PDF
          </button>
          <button className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600">
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypesConsommable;
