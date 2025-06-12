<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class FournisseurController extends Controller
{
    public function index()
    {
        try {
            $fournisseurs = Fournisseur::orderBy('nom_entreprise')->get();
            return response()->json($fournisseurs);
        } catch (\Throwable $e) {
            Log::error('Erreur dans FournisseurController@index: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur.'], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom_entreprise' => 'required|string|max:255',
            'ice' => ['nullable', 'string', 'max:255', Rule::unique('fournisseurs')],
            'num_compte_bancaire' => 'nullable|string|max:255',
            'num_telephone' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $fournisseur = Fournisseur::create($validator->validated());
            return response()->json($fournisseur, 201);
        } catch (\Throwable $e) {
            Log::error('Erreur dans FournisseurController@store: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur.'], 500);
        }
    }

    public function update(Request $request, Fournisseur $fournisseur)
    {
        $validator = Validator::make($request->all(), [
            'nom_entreprise' => 'required|string|max:255',
            'ice' => ['nullable', 'string', 'max:255', Rule::unique('fournisseurs')->ignore($fournisseur->id)],
            'num_compte_bancaire' => 'nullable|string|max:255',
            'num_telephone' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $fournisseur->update($validator->validated());
            return response()->json($fournisseur);
        } catch (\Throwable $e) {
            Log::error('Erreur dans FournisseurController@update pour ID ' . $fournisseur->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur.'], 500);
        }
    }

    public function destroy(Fournisseur $fournisseur)
    {
        try {
            $fournisseur->delete();
            return response()->json(null, 204);
        } catch (\Throwable $e) {
            Log::error('Erreur dans FournisseurController@destroy pour ID ' . $fournisseur->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur.'], 500);
        }
    }
}
