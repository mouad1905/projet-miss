<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Demande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DemandeController extends Controller
{
    /**
     * Récupère TOUTES les demandes (pour la vue admin "Les Demandes").
     */
    public function index()
    {
        try {
            // Charger les relations nécessaires pour l'affichage complet.
            // La relation imbriquée 'user.service' récupère aussi le service de l'utilisateur.
            $demandes = Demande::with(['user.service', 'article', 'fournisseur'])->latest('date_demande')->get();
            return response()->json($demandes);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DemandeController@index: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['message' => 'Erreur interne du serveur lors de la récupération de toutes les demandes.'], 500);
        }
    }

    /**
     * Récupère uniquement les demandes de l'utilisateur authentifié.
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
     * Récupère toutes les demandes qui ont été acceptées pour la page "Les Commandes".
     */
    public function getAcceptedDemandes()
    {
        try {
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


    /**
     * Crée une nouvelle demande.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'article_id' => 'required|integer|exists:articles,id',
            'quantite_demandee' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) { return response()->json(['errors' => $validator->errors()], 422); }

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
     * Affiche une demande spécifique.
     */
    public function show(Demande $demande)
    {
        $demande->load(['user.service', 'article', 'fournisseur']);
        return response()->json($demande);
    }


    /**
     * Met à jour une demande spécifique (par l'utilisateur).
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

        if ($validator->fails()) { return response()->json(['errors' => $validator->errors()], 422); }

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
            'updates' => 'required|json',
            'files.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,pdf|max:2048',
        ]);

        if ($validator->fails()) { return response()->json(['errors' => $validator->errors()], 422); }

        $updates = json_decode($request->updates, true);

        try {
            foreach ($updates as $id => $updateData) {
                $demande = Demande::find($id);
                if ($demande) {
                    $demande->update($updateData);

                    if ($request->hasFile("files.{$id}")) {
                        $file = $request->file("files.{$id}");
                        $path = $file->store('demande_fichiers', 'public');
                        $demande->fichier_path = $path;
                        $demande->save();
                    }
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
            return response()->json(null, 204); // 204 No Content
        } catch (\Throwable $e) {
            Log::error('Erreur dans DemandeController@destroy pour ID ' . $demande->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la suppression.'], 500);
        }
    }
    public function getDeliveredCommands()
    {
        try {
            $demandesAcceptees = Demande::with(['user.service.division', 'article', 'fournisseur'])
                ->where('status', 'Accepté')
                ->latest('date_demande')
                ->get();
                
            return response()->json($demandesAcceptees);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DemandeController@getDeliveredCommands: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur.'], 500);
        }
    }

    /**
     * Met à jour le statut de livraison d'une demande spécifique (par l'utilisateur).
     */
    public function updateDeliveryStatus(Request $request, Demande $demande)
    {
        // Sécurité : seul le demandeur peut mettre à jour le statut de livraison de sa propre demande.
        if ($demande->user_id !== Auth::id()) {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'statut_livraison' => 'required|string|in:Reçu,Non reçu',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $demande->statut_livraison = $request->statut_livraison;
            $demande->save();
            return response()->json($demande);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DemandeController@updateDeliveryStatus pour ID ' . $demande->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur.'], 500);
        }
    }
    public function getMyDeliveredCommands()
    {
         try {
            $demandes = Demande::with('article')
                ->where('user_id', Auth::id())
                // On récupère les commandes marquées comme "Livré" par l'admin,
                // ou celles que l'utilisateur a déjà traitées.
                ->whereIn('statut_livraison', ['Livré', 'Reçu', 'Non reçu'])
                ->latest('date_demande')
                ->get();
            return response()->json($demandes);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DemandeController@getMyDeliveredCommands: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur.'], 500);
        }
    }

    /**
     * Met à jour le statut de réception d'une demande spécifique (par l'utilisateur).
     */
    public function updateReceptionStatus(Request $request, Demande $demande)
    {
        // Sécurité : seul le demandeur peut mettre à jour le statut de réception.
        if ($demande->user_id !== Auth::id()) {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'statut_livraison' => 'required|string|in:Reçu,Non reçu',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $demande->statut_livraison = $request->statut_livraison;
            $demande->save();
            $demande->load('article'); // Recharger la relation pour une réponse cohérente
            return response()->json($demande);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DemandeController@updateReceptionStatus pour ID ' . $demande->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur.'], 500);
        }
    }
    public function getReadyForDelivery()
    {
        try {
            $demandes = Demande::with(['user', 'article', 'fournisseur'])
                ->where('status', 'Accepté')
                ->where('statut_livraison', 'En attente de livraison')
                ->latest('date_demande')
                ->get();
            return response()->json($demandes);
        } catch (\Throwable $e) {
            Log::error('Erreur dans DemandeController@getReadyForDelivery: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur.'], 500);
        }
    }
    
}
