<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\EmployeeType; // Assurez-vous d'importer le modèle
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class EmployeeTypeController extends Controller
{
    /**
     * Affiche la liste des types d'employeur.
     */
    public function index()
    {
        try {
            $employeeTypes = EmployeeType::orderBy('libelle')->get();
            return response()->json($employeeTypes);
        } catch (\Throwable $e) {
            Log::error('Erreur dans EmployeeTypeController@index: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la récupération des types d\'employeur.'], 500);
        }
    }

    /**
     * Enregistre un nouveau type d'employeur.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'libelle' => 'required|string|max:255|unique:employee_types,libelle',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $employeeType = EmployeeType::create($request->all());
            return response()->json($employeeType, 201);
        } catch (\Throwable $e) {
            Log::error('Erreur dans EmployeeTypeController@store: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la création du type d\'employeur.'], 500);
        }
    }

    /**
     * Met à jour un type d'employeur spécifique.
     */
    public function update(Request $request, EmployeeType $employeeType)
    {
        $validator = Validator::make($request->all(), [
            'libelle' => [
                'required',
                'string',
                'max:255',
                Rule::unique('employee_types')->ignore($employeeType->id),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $employeeType->update($request->all());
            return response()->json($employeeType);
        } catch (\Throwable $e) {
            Log::error('Erreur dans EmployeeTypeController@update pour ID ' . $employeeType->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la modification.'], 500);
        }
    }

    /**
     * Supprime un type d'employeur.
     */
    public function destroy(EmployeeType $employeeType)
    {
        try {
            $employeeType->delete(); // Utilise SoftDeletes si le trait est dans le modèle
            return response()->json(null, 204);
        } catch (\Throwable $e) {
            Log::error('Erreur dans EmployeeTypeController@destroy pour ID ' . $employeeType->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la suppression.'], 500);
        }
    }
}
