<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Demande extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'article_id',
        'quantite_demandee',
        'date_demande',
        'status', // Le statut peut être mis à jour
        'statut_livraison',
        'objet_marche',
        'reference_marche',
        'fournisseur_id', // Le fournisseur peut être mis à jour
        'fichier_path',
    ];

    protected $casts = [ 'date_demande' => 'date' ];

   public function user() { return $this->belongsTo(User::class); }
    public function article() { return $this->belongsTo(Article::class); }
    public function fournisseur() { return $this->belongsTo(Fournisseur::class); } 
}
