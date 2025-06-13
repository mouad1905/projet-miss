<?php

namespace App\Http\Controllers; // Assurez-vous que ce namespace correspond à l'emplacement de votre fichier

use App\Http\Controllers\Controller;
use App\Models\Demande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class DemandeController extends Controller
{
    /**
     * Récupère TOUTES les demandes (pour la vue admin "Les Demandes").
     */
    public function index()
    {
        try {
            // Charger les relations nécessaires pour l'affichage complet
            $demandes = Demande::with(['user.service', 'article', 'fournisseur'])->latest('date_demande')->get();
            return response()->json($demandes);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DemandeController@index: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la récupération de toutes les demandes.'], 500);
        }
    }

    /**
     * Récupère uniquement les demandes de l'utilisateur authentifié
     * (pour la vue "Mes Demandes").
     */
    public function myDemandes()
    {
        try {
            $demandes = Demande::with('article')
                ->where('user_id', Auth::id())
                ->latest('date_demande')
                ->get();
            return response()->json($demandes);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DemandeController@myDemandes: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la récupération de vos demandes.'], 500);
        }
    }

    /**
     * Crée une nouvelle demande pour l'utilisateur authentifié.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'article_id' => 'required|integer|exists:articles,id',
            'quantite_demandee' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $demande = Demande::create([
                'user_id' => Auth::id(),
                'article_id' => $request->article_id,
                'quantite_demandee' => $request->quantite_demandee,
                'date_demande' => now(),
                'status' => 'En cours', // Statut par défaut
            ]);
            $demande->load('article');
            return response()->json($demande, 201);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DemandeController@store: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la création de la demande.'], 500);
        }
    }

    /**
     * Met à jour une demande spécifique.
     * Utilisé par l'utilisateur pour modifier sa propre demande.
     */
    public function update(Request $request, Demande $demande)
    {
        // Sécurité : seul le créateur peut modifier sa demande si elle est "En cours"
        if ($demande->user_id !== Auth::id() || $demande->status !== 'En cours') {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'article_id' => 'required|integer|exists:articles,id',
            'quantite_demandee' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $demande->update($validator->validated());
            $demande->load('article');
            return response()->json($demande);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DemandeController@update pour ID ' . $demande->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la modification.'], 500);
        }
    }

    /**
     * Met à jour plusieurs demandes en une seule fois (pour l'admin).
     */
    public function batchUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'updates' => 'required|array',
            'updates.*.id' => 'required|integer|exists:demandes,id',
            'updates.*.status' => 'nullable|string|in:Accepté,Rejeté,En cours',
            'updates.*.fournisseur_id' => 'nullable|integer|exists:fournisseurs,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            foreach ($request->updates as $updateData) {
                $demande = Demande::find($updateData['id']);
                if ($demande) {
                    $demande->update($updateData);
                }
            }
            return response()->json(['message' => 'Demandes mises à jour avec succès!']);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DemandeController@batchUpdate: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la mise à jour.'], 500);
        }
    }

    /**
     * Supprime une demande spécifique.
     */
    public function destroy(Demande $demande)
    {
        // Sécurité : seul le créateur peut supprimer sa demande si elle est "En cours"
        if ($demande->user_id !== Auth::id() || $demande->status !== 'En cours') {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        try {
            $demande->delete();
            return response()->json(null, 204);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DemandeController@destroy pour ID ' . $demande->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la suppression.'], 500);
        }
    }
    public function getAcceptedDemandes()
    {
        try {
            // On récupère les demandes où le statut est 'Accepté'
            $demandesAcceptees = Demande::with(['user', 'article', 'fournisseur'])
                ->where('status', 'Accepté')
                ->latest('date_demande')
                ->get();
                
            return response()->json($demandesAcceptees);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DemandeController@getAcceptedDemandes: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la récupération des commandes.'], 500);
        }
    }
}
