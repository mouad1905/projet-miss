<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // À inclure si votre table utilise la suppression douce

class Bureau extends Model
{
    // Utilise les fonctionnalités de base, les factories pour les tests, et la suppression douce
    use HasFactory, SoftDeletes;

    /**
     * Le nom de la table associée au modèle.
     * Laravel le devine comme "bureaux" (pluriel de "Bureau"), mais il est bon de le spécifier.
     *
     * @var string
     */
    protected $table = 'bureaux';

    /**
     * Les attributs qui peuvent être assignés en masse.
     * C'est une mesure de sécurité. Vous devez lister ici tous les champs que vous
     * remplissez via Bureau::create() ou $bureau->update().
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'libelle',
        'abreviation',
        'service_id',
        // Ajoutez les champs _by si vous les gérez via create/update
        // 'created_by',
        // 'updated_by',
        // 'deleted_by',
    ];

    /**
     * Les attributs qui doivent être traités comme des dates.
     * Utile pour la suppression douce.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * Relation: Un bureau appartient à un service.
     * Le nom de la fonction ('service') est important, c'est ce que vous utiliserez
     * avec with('service') dans votre contrôleur.
     */
    public function service()
    {
        // Spécifie que ce modèle appartient à un modèle Service,
        // via la clé étrangère 'service_id'.
        return $this->belongsTo(Service::class);
    }
    
    // Vous pouvez ajouter ici la logique de la méthode boot() pour remplir
    // automatiquement les champs created_by, updated_by, deleted_by
    // si vous le souhaitez, comme nous l'avons fait pour le modèle User.
    
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (auth()->check()) {
                $model->created_by = auth()->id();
                $model->updated_by = auth()->id();
            }
        });

        static::updating(function ($model) {
            if (auth()->check()) {
                $model->updated_by = auth()->id();
            }
        });

        static::deleting(function ($model) {
            if (!$model->forceDeleting && auth()->check()) {
                $model->deleted_by = auth()->id();
                $model->save();
            }
        });
    }
    
}