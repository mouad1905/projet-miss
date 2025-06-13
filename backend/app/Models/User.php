<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /**
     * Les traits sont des fonctionnalités que l'on ajoute à notre classe User.
     * HasApiTokens: Pour l'authentification API avec Laravel Sanctum.
     * HasFactory: Pour les tests (génération de fausses données).
     * Notifiable: Pour la gestion des notifications (ex: emails).
     * SoftDeletes: Pour la suppression douce (la colonne `deleted_at`).
     */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * La propriété '$fillable' est une mesure de sécurité.
     * Elle définit une "liste blanche" des colonnes que vous autorisez à être
     * remplies en masse via des méthodes comme User::create().
     */
    protected $fillable = [
        'nom',
        'prenom',
        'nom_utilisateur',
        'email',
        'password',
        'num_telephone',
        'cin',
        'role',
        'service_id',       // <-- Assurez-vous que ce champ est présent
        'type_employer_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    /**
     * La propriété '$hidden' définit les attributs qui ne doivent JAMAIS
     * être inclus dans les réponses JSON.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * La propriété '$casts' permet de convertir automatiquement des attributs
     * d'un type à un autre.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * RELATION : Un utilisateur appartient à un service.
     * C'est crucial pour que `with('service')` fonctionne dans le contrôleur.
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * RELATION : Un utilisateur appartient à un type d'employeur.
     */
    public function employeeType()
    {
        return $this->belongsTo(EmployeeType::class, 'type_employer_id');
    }

    // ... (les autres relations et fonctions comme hasRole, etc.)
}
