<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User; // Assurez-vous d'importer le modèle User
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Pour logger les erreurs en cas de problème

class UserController extends Controller
{
    /**
     * Affiche une liste de tous les utilisateurs pour la vue d'administration.
     */
    public function index()
    {
        try {
            // 'with()' est la clé ici. Il demande à Laravel de charger en même temps
            // les informations des tables associées via les relations 'service' et 'employeeType'
            // définies dans le modèle User. C'est la méthode la plus performante.
            $users = User::with(['service', 'employeeType'])->latest()->get();

            // Si tout va bien, on renvoie les utilisateurs en format JSON.
            return response()->json($users);

        } catch (\Throwable $e) {
            // Si une erreur se produit (ex: une relation n'est pas définie dans le modèle),
            // elle sera interceptée ici.

            // On enregistre l'erreur complète dans les logs pour le débogage.
            Log::error('Erreur dans UserController@index: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            
            // On renvoie une réponse d'erreur JSON claire au frontend.
            return response()->json([
                'message' => 'Erreur interne du serveur lors de la récupération des utilisateurs.'
            ], 500);
        }
    }

    // Ici se trouveraient vos autres méthodes pour gérer les utilisateurs
    // par un administrateur (store, update, destroy).
    // Pour l'instant, seule la méthode index() est nécessaire pour afficher la liste.

    /**
     * Affiche un utilisateur spécifique.
     */
    public function show(User $user)
    {
        // Charger les relations pour être sûr que la réponse est complète
        $user->load(['service', 'employeeType']);
        return response()->json($user);
    }

    // Vous pouvez ajouter les méthodes store, update, et destroy plus tard si vous
    // souhaitez que les administrateurs puissent gérer les utilisateurs depuis cette interface.
}
