<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'libelle',
        'description',
        'unite_mesure',
        'cout_unitaire',
        'seuil_expiration_jours',
        'seuil_rupture_stock',
        'type_consommable', // Champ texte
        'type_stockage',    // Champ texte
        'article_category_id', // Clé étrangère
    ];

    // Relation vers ArticleCategory (celle-ci reste)
    public function articleCategory()
    {
        return $this->belongsTo(ArticleCategory::class);
    }
    public function demandes() { return $this->hasMany(Demande::class); }

    // Les relations vers ConsommableCategory et StockageCategory sont supprimées
}
