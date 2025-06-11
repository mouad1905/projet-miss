<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // À inclure si votre table utilise la suppression douce

class EmployeeType extends Model
{
    // Utilise les fonctionnalités de base, les factories pour les tests, et la suppression douce
    use HasFactory, SoftDeletes;

    /**
     * Le nom de la table associée au modèle.
     * Laravel le devine comme "employee_types", mais c'est une bonne pratique de le spécifier.
     *
     * @var string
     */
    protected $table = 'employee_types';

    /**
     * Les attributs qui peuvent être assignés en masse.
     * C'est une mesure de sécurité. Vous devez lister ici le champ 'libelle'
     * pour pouvoir l'enregistrer via la méthode create().
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'libelle',
    ];

    /**
     * Les attributs qui doivent être traités comme des dates.
     * Nécessaire pour que SoftDeletes fonctionne correctement.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * Relation: Un type d'employeur peut avoir plusieurs utilisateurs.
     * Ceci est l'inverse de la relation belongsTo dans le modèle User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany(User::class, 'type_employer_id');
    }
}
