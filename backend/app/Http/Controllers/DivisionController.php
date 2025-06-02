<?php

// app/Http/Controllers/Api/DivisionController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Division;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Pour récupérer l'utilisateur authentifié
use Illuminate\Support\Facades\Validator;

class DivisionController extends Controller
{
    public function index()
{
    try {
        // Récupérer toutes les divisions
        $divisions = Division::orderBy('libelle')->get(); // Assurez-vous que App\Models\Division est le bon namespace
        return response()->json($divisions);
    } catch (\Exception $e) {
        // Log l'erreur pour le débogage
        \Illuminate\Support\Facades\Log::error('Erreur dans DivisionController@index: ' . $e->getMessage());
        // Renvoyer une réponse d'erreur JSON
        return response()->json(['message' => 'Une erreur interne est survenue lors de la récupération des divisions.', 'error' => $e->getMessage()], 500);
    }
}

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'libelle' => 'required|string|max:255|unique:divisions,libelle',
            // Vous pouvez ajouter d'autres validations si nécessaire
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $dataToCreate = ['libelle' => $request->libelle];

        // Si vous ne gérez pas CreatedBy via les événements du modèle :
        // if (Auth::check()) {
        //     $dataToCreate['CreatedBy'] = Auth::id(); // ou Auth::user()->name;
        // }
        // Si vous n'utilisez pas useCurrent() pour CreatedAt dans la migration et ne le gérez pas dans le modèle :
        // $dataToCreate['CreatedAt'] = now();


        $division = Division::create($dataToCreate);

        return response()->json($division, 201);
    }

    // Exemple de méthode de suppression (douce)
    public function destroy(Division $division) // Utilise le Route Model Binding
    {
        // Si vous ne gérez pas DeletedBy via les événements du modèle :
        // if (Auth::check()) {
        //     $division->DeletedBy = Auth::id();
        //     $division->save(); // Sauvegarder avant de supprimer pour enregistrer DeletedBy
        // }

        $division->delete(); // Ceci effectuera une suppression douce

        return response()->json(null, 204); // 204 No Content
    }

    // Pour récupérer les éléments supprimés (si besoin pour une corbeille par exemple)
    // public function trashed()
    // {
    //     $divisions = Division::onlyTrashed()->get();
    //     return response()->json($divisions);
    // }

    // Pour restaurer un élément supprimé
    // public function restore($id)
    // {
    //     $division = Division::onlyTrashed()->find($id);
    //     if ($division) {
    //         $division->restore();
    //         // Vous pourriez vouloir effacer DeletedBy ici
    //         // $division->DeletedBy = null;
    //         // $division->save();
    //         return response()->json($division);
    //     }
    //     return response()->json(['message' => 'Division non trouvée dans la corbeille'], 404);
    // }
}
