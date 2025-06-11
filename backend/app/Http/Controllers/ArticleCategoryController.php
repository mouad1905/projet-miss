<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ArticleCategory; // Assurez-vous d'importer le modèle
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ArticleCategoryController extends Controller
{
    /**
     * Affiche une liste des catégories d'articles.
     */
    public function index()
    {
        try {
            $categories = ArticleCategory::orderBy('libelle')->get();
            return response()->json($categories);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ArticleCategoryController@index: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la récupération des catégories d\'articles.'], 500);
        }
    }

    /**
     * Enregistre une nouvelle catégorie d'article.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'libelle' => 'required|string|max:255|unique:article_categories,libelle',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $category = ArticleCategory::create($request->all());
            return response()->json($category, 201);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ArticleCategoryController@store: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la création de la catégorie.'], 500);
        }
    }

    /**
     * Affiche une catégorie d'article spécifique.
     */
    public function show(ArticleCategory $articleCategory)
    {
        return response()->json($articleCategory);
    }

    /**
     * Met à jour une catégorie d'article spécifique.
     */
    public function update(Request $request, ArticleCategory $articleCategory)
    {
        $validator = Validator::make($request->all(), [
            'libelle' => [
                'required',
                'string',
                'max:255',
                Rule::unique('article_categories')->ignore($articleCategory->id),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreurs de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $articleCategory->update($request->all());
            return response()->json($articleCategory);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ArticleCategoryController@update pour ID ' . $articleCategory->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la modification.'], 500);
        }
    }

    /**
     * Supprime une catégorie d'article.
     */
    public function destroy(ArticleCategory $articleCategory)
    {
        try {
            $articleCategory->delete();
            return response()->json(null, 204);
        } catch (\Throwable $e) {
            Log::error('Erreur dans ArticleCategoryController@destroy pour ID ' . $articleCategory->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur lors de la suppression.'], 500);
        }
    }
}
