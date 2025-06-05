<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Service; // Assurez-vous que le namespace du modèle est correct
use App\Models\Division; // Nécessaire pour la validation de division_id
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth; // Si vous utilisez Auth pour les champs _by

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Cette ligne est la plus susceptible de causer une erreur 500
            // si la connexion DB, la table/modèle, ou la relation a un problème.
            $services = Service::with('division')->orderBy('libelle')->get();
            return response()->json($services);
        } catch (\Throwable $e) {
            Log::error(
                'Erreur dans ServiceController@index: ' . $e->getMessage() .
                "\nFichier: " . $e->getFile() .
                "\nLigne: " . $e->getLine() .
                "\nTrace: " . $e->getTraceAsString()
            );
            return response()->json([
                'message' => 'Une erreur interne est survenue lors de la récupération des services.',
                'error_details' => $e->getMessage() // Pour le débogage
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'libelle' => 'required|string|max:255',
            // S'assurer que division_id est fourni et qu'il existe dans la table 'divisions'
            'division_id' => 'required|integer|exists:divisions,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $dataToCreate = [
                'libelle' => $request->libelle,
                'division_id' => $request->division_id,
            ];

            // Optionnel: Remplir created_by si l'utilisateur est authentifié
            // if (Auth::check()) {
            //     $dataToCreate['created_by'] = Auth::id();
            // }

            $service = Service::create($dataToCreate);
            // Charger la relation division pour la réponse
            $service->load('division');

            return response()->json($service, 201);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ServiceController@store: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['message' => 'Erreur interne du serveur lors de la création du service.', 'error_details' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Service  $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Service $service) // Utilise le Route Model Binding
    {
        try {
            // Charger la relation division
            $service->load('division');
            return response()->json($service);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ServiceController@show pour ID ' . $service->id . ': ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['message' => 'Erreur interne du serveur lors de la récupération du service.', 'error_details' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Service  $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Service $service)
    {
        $validator = Validator::make($request->all(), [
            'libelle' => 'required|string|max:255',
            // S'assurer que division_id est fourni et qu'il existe dans la table 'divisions'
            'division_id' => 'required|integer|exists:divisions,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $dataToUpdate = [
                'libelle' => $request->libelle,
                'division_id' => $request->division_id,
            ];

            // Optionnel: Remplir updated_by si l'utilisateur est authentifié
            // if (Auth::check()) {
            //     $dataToUpdate['updated_by'] = Auth::id();
            // }

            $service->update($dataToUpdate);
            // Recharger la relation division pour la réponse
            $service->load('division');

            return response()->json($service);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ServiceController@update pour ID ' . $service->id . ': ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['message' => 'Erreur interne du serveur lors de la modification du service.', 'error_details' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Service  $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Service $service)
    {
        try {
            // Optionnel: Remplir deleted_by si l'utilisateur est authentifié et si SoftDeletes est utilisé
            // if (Auth::check() && method_exists($service, 'isForceDeleting') && !$service->isForceDeleting()) {
            //     $service->deleted_by = Auth::id();
            //     $service->save(); // Sauvegarder avant la suppression douce
            // }

            $service->delete(); // Effectue une suppression douce si le modèle utilise SoftDeletes
            return response()->json(null, 204); // 204 No Content
        } catch (\Throwable $e) {
            Log::error('Erreur dans ServiceController@destroy pour ID ' . $service->id . ': ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['message' => 'Erreur interne du serveur lors de la suppression du service.', 'error_details' => $e->getMessage()], 500);
        }
    }
}
