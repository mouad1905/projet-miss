<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ArticleController extends Controller
{
    public function index()
    {
        try {
            // On charge l'article avec seulement sa catégorie d'article associée
            $articles = Article::with('articleCategory')->orderBy('libelle')->get();
            return response()->json($articles);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ArticleController@index: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur.'], 500);
        }
    }

    public function store(Request $request)
    {
        // Validation simplifiée
        $validator = Validator::make($request->all(), [
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unite_mesure' => 'nullable|string|max:50',
            'cout_unitaire' => 'nullable|numeric|min:0',
            'seuil_expiration_jours' => 'nullable|integer|min:0',
            'seuil_rupture_stock' => 'nullable|integer|min:0',
            'type_consommable' => 'required|string|max:50', // C'est maintenant une chaîne
            'type_stockage' => 'required|string|max:50',    // C'est maintenant une chaîne
            'article_category_id' => 'required|integer|exists:article_categories,id', // Seule la clé étrangère restante est validée
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $article = Article::create($validator->validated());
            $article->load('articleCategory');
            return response()->json($article, 201);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ArticleController@store: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur.'], 500);
        }
    }

    public function update(Request $request, Article $article)
    {
        // La validation pour update est aussi simplifiée
        $validator = Validator::make($request->all(), [
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unite_mesure' => 'nullable|string|max:50',
            'cout_unitaire' => 'nullable|numeric|min:0',
            'seuil_expiration_jours' => 'nullable|integer|min:0',
            'seuil_rupture_stock' => 'nullable|integer|min:0',
            'type_consommable' => 'required|string|max:50',
            'type_stockage' => 'required|string|max:50',
            'article_category_id' => 'required|integer|exists:article_categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $article->update($validator->validated());
            $article->load('articleCategory');
            return response()->json($article);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ArticleController@update pour ID ' . $article->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur.'], 500);
        }
    }

    public function destroy(Article $article)
    {
        try {
            $article->delete();
            return response()->json(null, 204);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ArticleController@destroy pour ID ' . $article->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur.'], 500);
        }
    }
}

