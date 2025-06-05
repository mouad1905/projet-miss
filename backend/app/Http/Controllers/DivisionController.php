<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Division;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Si vous utilisez Auth pour CreatedBy/LastUpdatedBy/DeletedBy
use Illuminate\Support\Facades\Log;   // <<< --- AJOUTEZ OU VÉRIFIEZ CETTE LIGNE --- >>>
use Illuminate\Support\Facades\Validator;

class DivisionController extends Controller
{
    public function index()
    {
        try {
            $divisions = Division::orderBy('libelle')->get();
            return response()->json($divisions);
        } catch (\Throwable $e) { // Utiliser Throwable pour attraper toutes les erreurs/exceptions
            // Utilisation correcte de la façade Log
            Log::error(
                'Erreur dans DivisionController@index: ' . $e->getMessage() .
                "\nFichier: " . $e->getFile() .
                "\nLigne: " . $e->getLine() .
                "\nTrace: " . $e->getTraceAsString()
            );
            return response()->json([
                'message' => 'Une erreur interne est survenue lors de la récupération des divisions.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'libelle' => 'required|string|max:255|unique:divisions,libelle',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $dataToCreate = ['libelle' => $request->libelle];
            // Si vous gérez CreatedBy manuellement et avez l'authentification
            // if (Auth::check()) {
            //     $dataToCreate['CreatedBy'] = Auth::id();
            // }

            $division = Division::create($dataToCreate);
            return response()->json($division, 201);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DivisionController@store: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['message' => 'Erreur interne du serveur lors de la création de la division.', 'error_details' => $e->getMessage()], 500);
        }
    }

    public function show(Division $division)
    {
        return response()->json($division);
    }

    public function update(Request $request, Division $division)
    {
        $validator = Validator::make($request->all(), [
            'libelle' => 'required|string|max:255|unique:divisions,libelle,' . $division->id,
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $dataToUpdate = ['libelle' => $request->libelle];
            // Si vous gérez LastUpdatedBy manuellement
            // if (Auth::check()) {
            //     $dataToUpdate['LastUpdatedBy'] = Auth::id();
            // }

            $division->update($dataToUpdate);
            return response()->json($division);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DivisionController@update pour ID ' . $division->id . ': ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['message' => 'Erreur interne du serveur lors de la modification de la division.', 'error_details' => $e->getMessage()], 500);
        }
    }

    public function destroy(Division $division)
    {
        try {
            // Si vous gérez DeletedBy manuellement pour SoftDeletes
            // if (Auth::check() && method_exists($division, 'isForceDeleting') && !$division->isForceDeleting()) {
            //     $division->DeletedBy = Auth::id();
            //     $division->save();
            // }

            $division->delete();
            return response()->json(null, 204);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DivisionController@destroy pour ID ' . $division->id . ': ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['message' => 'Erreur interne du serveur lors de la suppression de la division.', 'error_details' => $e->getMessage()], 500);
        }
    }
}
