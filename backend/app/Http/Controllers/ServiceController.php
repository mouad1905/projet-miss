<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    /**
     * Affiche une liste des services.
     */
    public function index()
    {
        try {
            // Utiliser with('division') pour charger les informations de la division associée
            $services = Service::with('division')->orderBy('libelle')->get();
            return response()->json($services);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ServiceController@index: ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur interne est survenue lors de la récupération des services.'], 500);
        }
    }

    /**
     * Enregistre un nouveau service dans la base de données.
     */
    public function store(Request $request)
    {
        // Valider les données reçues du formulaire React
        $validator = Validator::make($request->all(), [
            'libelle' => 'required|string|max:255',
            'division_id' => 'required|integer|exists:divisions,id', // Vérifie que la division existe
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            // Si la validation passe, créer le service
            // Service::create() ne fonctionnera que si les champs sont dans $fillable du modèle Service
            $service = Service::create([
                'libelle' => $request->libelle,
                'division_id' => $request->division_id,
            ]);

            // Recharger la relation 'division' pour que la réponse JSON la contienne
            $service->load('division');

            // Renvoyer le service nouvellement créé avec un statut 201 (Created)
            return response()->json($service, 201);

        } catch (\Throwable $e) {
            // Logger l'erreur pour le débogage
            Log::error('Erreur dans ServiceController@store: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            
            // Renvoyer une réponse d'erreur JSON claire
            return response()->json(['message' => 'Erreur interne du serveur lors de la création du service.'], 500);
        }
    }

    /**
     * Met à jour un service spécifique.
     */
    public function update(Request $request, Service $service)
    {
        $validator = Validator::make($request->all(), [
            'libelle' => 'required|string|max:255',
            'division_id' => 'required|integer|exists:divisions,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $service->update($request->all());
            $service->load('division'); // Recharger la relation après la mise à jour
            return response()->json($service);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ServiceController@update pour ID ' . $service->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la modification du service.'], 500);
        }
    }

    /**
     * Supprime un service.
     */
    public function destroy(Service $service)
    {
        try {
            $service->delete(); // Effectue une suppression douce si le trait SoftDeletes est utilisé
            return response()->json(null, 204); // Succès, pas de contenu à renvoyer
        } catch (\Throwable $e) {
            Log::error('Erreur dans ServiceController@destroy pour ID ' . $service->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la suppression du service.'], 500);
        }
    }
}
