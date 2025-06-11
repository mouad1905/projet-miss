<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Bureau;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BureauController extends Controller
{
    /**
     * Affiche une liste des bureaux.
     */
    public function index()
    {
        try {
            // Charger les bureaux avec les informations de leur service ET
            // les informations de la division de ce service.
            // C'est très efficace pour le frontend.
            $bureaux = Bureau::with('service.division')->orderBy('libelle')->get();
            return response()->json($bureaux);
        } catch (\Throwable $e) {
            Log::error('Erreur dans BureauController@index: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la récupération des bureaux.'], 500);
        }
    }

    /**
     * Enregistre un nouveau bureau.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'libelle' => 'required|string|max:255',
            'abreviation' => 'required|string|max:255',
            'service_id' => 'required|integer|exists:services,id', // Vérifie que le service existe
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $bureau = Bureau::create($request->all());
            
            // Recharger les relations pour la réponse JSON
            $bureau->load('service.division');

            return response()->json($bureau, 201);
        } catch (\Throwable $e) {
            Log::error('Erreur dans BureauController@store: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la création du bureau.'], 500);
        }
    }

    /**
     * Affiche un bureau spécifique.
     */
    public function show(Bureau $bureau)
    {
        // Charger les relations avant de renvoyer la réponse
        $bureau->load('service.division');
        return response()->json($bureau);
    }

    /**
     * Met à jour un bureau spécifique.
     */
    public function update(Request $request, Bureau $bureau)
    {
        $validator = Validator::make($request->all(), [
            'libelle' => 'required|string|max:255',
            'abreviation' => 'required|string|max:255',
            'service_id' => 'required|integer|exists:services,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $bureau->update($request->all());
            
            // Recharger les relations pour la réponse JSON
            $bureau->load('service.division');

            return response()->json($bureau);
        } catch (\Throwable $e) {
            Log::error('Erreur dans BureauController@update pour ID ' . $bureau->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la modification du bureau.'], 500);
        }
    }

    /**
     * Supprime un bureau.
     */
    public function destroy(Bureau $bureau)
    {
        try {
            $bureau->delete(); // Effectue une suppression douce si le trait SoftDeletes est utilisé
            return response()->json(null, 204); // Succès, pas de contenu à renvoyer
        } catch (\Throwable $e) {
            Log::error('Erreur dans BureauController@destroy pour ID ' . $bureau->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la suppression du bureau.'], 500);
        }
    }
}