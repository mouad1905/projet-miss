<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule; // Pour les règles de validation plus complexes si besoin

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'nom_utilisateur' => 'required|string|max:255|unique:users,nom_utilisateur',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed', // 'password_confirmation' doit être envoyé
            'num_telephone' => 'nullable|string|max:20|unique:users,num_telephone',
            'cin' => 'nullable|string|max:20|unique:users,cin',
            'role' => ['required', 'string', Rule::in(['admin', 'employe', 'manager'])], // Exemples de rôles, adaptez
            'type_employer_id' => 'nullable|exists:employee_types,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'nom_utilisateur' => $request->nom_utilisateur,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'num_telephone' => $request->num_telephone,
            'cin' => $request->cin,
            'role' => $request->role,
            'type_employer_id' => $request->type_employer_id,
            // created_by et updated_by seront remplis par le modèle si l'utilisateur est authentifié (admin créant un user)
            // Si c'est un auto-enregistrement, created_by pourrait être null ou l'ID de l'utilisateur lui-même
        ]);

        // $token = $user->createToken('auth_token')->plainTextToken; // Si vous utilisez Sanctum Token API

        return response()->json([
            'message' => 'Utilisateur enregistré avec succès!',
            'user' => $user,
            // 'access_token' => $token, // Si token API
            // 'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login'    => 'required|string', // Peut être nom_utilisateur ou email
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $loginType = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'nom_utilisateur';

        $credentials = [
            $loginType => $request->login,
            'password' => $request->password
        ];

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken; // Pour Sanctum Token API

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        if (Auth::check()) { // S'assurer que l'utilisateur est authentifié
            $request->user()->currentAccessToken()->delete(); // Pour Sanctum Token API
            // Ou pour l'authentification web/session de Sanctum :
            // Auth::guard('web')->logout();
            // $request->session()->invalidate();
            // $request->session()->regenerateToken();
        }


        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
