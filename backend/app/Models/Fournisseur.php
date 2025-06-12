<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // À inclure si votre table utilise la suppression douce

class Fournisseur extends Model
{
    // Utilise les fonctionnalités de base de Laravel, les factories pour les tests, et la suppression douce
    use HasFactory, SoftDeletes;

    /**
     * Le nom de la table associée au modèle.
     * Laravel devine "fournisseurs", mais c'est une bonne pratique de le spécifier explicitement.
     *
     * @var string
     */
    protected $table = 'fournisseurs';

    /**
     * Les attributs qui peuvent être assignés en masse.
     * C'est une mesure de sécurité. Vous devez lister ici tous les champs que vous
     * remplissez via Fournisseur::create() ou $fournisseur->update().
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom_entreprise',
        'ice',
        'num_compte_bancaire',
        'num_telephone',
        // Ajoutez les champs _by si vous les gérez via create/update et qu'ils sont dans la table
        // 'created_by',
        // 'updated_by',
        // 'deleted_by',
    ];

    /**
     * Les attributs qui doivent être traités comme des dates.
     * Nécessaire pour que SoftDeletes fonctionne correctement.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    // Si un fournisseur avait des relations (par exemple, avec des articles),
    // elles seraient définies ici. Pour l'instant, il n'y en a pas.
}
