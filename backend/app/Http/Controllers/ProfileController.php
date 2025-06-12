<?php

// Fichier : app/Http/Controllers/Api/ProfileController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * Met à jour les informations de profil de l'utilisateur authentifié.
     * Attend 'nom_utilisateur' dans la requête.
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'nom_utilisateur' => [
                'required',
                'string',
                'max:255',
                // La règle unique ignore l'utilisateur actuel pour s'assurer
                // que le nom d'utilisateur n'est pas déjà pris par quelqu'un d'autre.
                Rule::unique('users')->ignore($user->id),
            ],
            // Vous pouvez ajouter d'autres champs ici si vous permettez leur modification
            // 'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            // Mettre à jour l'utilisateur avec les données validées
            $user->update($validator->validated());

            // Renvoyer les informations utilisateur mises à jour
            return response()->json($user);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ProfileController@updateProfile pour l\'utilisateur ' . $user->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur interne est survenue lors de la mise à jour du profil.'], 500);
        }
    }

    /**
     * Change le mot de passe de l'utilisateur authentifié.
     */
    public function changePassword(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'current_password' => ['required', 'string'],
            // 'confirmed' s'attend à recevoir un champ 'password_confirmation' dans la requête
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        // Vérifier si le mot de passe actuel fourni correspond à celui dans la base de données
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect.',
                'errors' => ['current_password' => ['Le mot de passe actuel est incorrect.']]
            ], 422);
        }

        try {
            // Mettre à jour le mot de passe de l'utilisateur avec la nouvelle valeur hachée
            $user->update([
                'password' => Hash::make($request->password)
            ]);

            return response()->json(['message' => 'Mot de passe changé avec succès!']);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ProfileController@changePassword pour l\'utilisateur ' . $user->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur interne est survenue lors du changement de mot de passe.'], 500);
        }
    }
}
