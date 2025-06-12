<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ArticleCategory extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Le nom de la table associée au modèle.
     */
    protected $table = 'article_categories';

    /**
     * Les attributs qui peuvent être assignés en masse.
     */
    protected $fillable = [
        'libelle',
    ];

    /**
     * Les attributs qui doivent être traités comme des dates.
     */
    protected $dates = ['deleted_at'];

    // Si vous voulez définir une relation inverse (une catégorie a plusieurs articles),
    // vous pouvez l'ajouter ici.
    // public function articles()
    // {
    //     return $this->hasMany(Article::class, 'categorie_article_id');
    // }
}
