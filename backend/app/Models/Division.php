<?php

// app/Models/Division.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // Importer SoftDeletes

class Division extends Model
{
    use HasFactory, SoftDeletes; // Utiliser SoftDeletes

    /**
     * Les noms des colonnes 'created_at', 'updated_at', 'deleted_at'
     * Si vous utilisez des noms personnalisés.
     * Laravel s'attend à 'created_at', 'updated_at', 'deleted_at'.
     * Si vous avez nommé vos colonnes EXACTEMENT 'CreatedAt', 'LastUpdatedAt', 'DeletedAt'
     * vous devez le spécifier ici.
     */
    const CREATED_AT = 'CreatedAt'; // Si vous avez utilisé ce nom exact dans la migration
    const UPDATED_AT = 'LastUpdatedAt'; // Si vous avez utilisé ce nom exact
    const DELETED_AT = 'DeletedAt'; // Laravel SoftDeletes utilise par défaut 'deleted_at'

    /**
     * Les attributs qui doivent être traités comme des dates.
     * Laravel convertira automatiquement ces colonnes en instances Carbon.
     *
     * @var array
     */
    protected $dates = [
        'CreatedAt',
        'LastUpdatedAt',
        'DeletedAt', // La colonne utilisée par SoftDeletes
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'libelle',
        'CreatedBy',      // Ajouter si vous voulez les remplir via create() ou update()
        'LastUpdatedBy',  // Ajouter si vous voulez les remplir
        'DeletedBy',      // Ajouter si vous voulez les remplir
        // Ne pas mettre 'CreatedAt' ou 'LastUpdatedAt' ici si Laravel les gère automatiquement
        // ou si vous les définissez manuellement.
    ];

    /**
     * Événements de modèle pour remplir automatiquement CreatedBy, LastUpdatedBy, DeletedBy.
     * Ceci est une façon de le faire. Une autre serait via des Observers ou dans le contrôleur.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Assurez-vous que l'utilisateur est authentifié si vous utilisez auth()->id()
            if (auth()->check()) {
                $model->CreatedBy = auth()->id(); // ou auth()->user()->name, ou un autre identifiant
            }
            // Si vous n'utilisez pas les timestamps par défaut de Laravel et avez nommé vos colonnes
            // CreatedAt et LastUpdatedAt, vous pourriez avoir besoin de les définir ici aussi
            // si useCurrent() n'est pas utilisé ou si vous voulez un contrôle total.
            // $model->CreatedAt = now();
        });

        static::updating(function ($model) {
            if (auth()->check()) {
                $model->LastUpdatedBy = auth()->id();
            }
            // $model->LastUpdatedAt = now();
        });

        // Pour SoftDeletes, Laravel gère DeletedAt automatiquement.
        // Si vous voulez aussi remplir DeletedBy lors d'une suppression douce :
        static::deleting(function ($model) {
            // Vérifiez si c'est une suppression douce (forceDeleting est false)
            if (!$model->forceDeleting && auth()->check()) {
                $model->DeletedBy = auth()->id();
                $model->save(); // Important de sauvegarder après avoir modifié DeletedBy
            }
        });
    }
}
