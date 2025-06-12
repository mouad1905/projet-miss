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
        'role', // La colonne pour le rôle de l'utilisateur
        'type_employer_id',
        'created_by', // Qui a créé cet utilisateur
        'updated_by', // Qui a modifié cet utilisateur en dernier
        'deleted_by', // Qui a supprimé cet utilisateur
    ];

    /**
     * La propriété '$hidden' définit les attributs qui ne doivent JAMAIS
     * être inclus dans les réponses JSON. C'est crucial pour la sécurité,
     * afin de ne jamais exposer les mots de passe.
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
        'email_verified_at' => 'datetime', // Convertit 'email_verified_at' en objet Carbon (pour les dates)
        'password' => 'hashed',            // S'assure que tout mot de passe assigné est automatiquement haché (Laravel 9+)
    ];

    /**
     * RELATION : Un utilisateur appartient à un type d'employeur.
     * Ceci définit la relation "inverse" de "un-vers-plusieurs".
     * Permet de faire $user->employeeType pour récupérer les infos de son type.
     */
    public function employeeType()
    {
        return $this->belongsTo(EmployeeType::class, 'type_employer_id');
    }

    /**
     * RELATION : L'utilisateur qui a créé cet enregistrement.
     * C'est une relation vers le modèle User lui-même.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * RELATION : L'utilisateur qui a mis à jour cet enregistrement en dernier.
     */
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * RELATION : L'utilisateur qui a supprimé cet enregistrement.
     */
    public function deleter()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    /**
     * FONCTION UTILE : Vérifie si l'utilisateur a un rôle spécifique.
     * Permet d'écrire du code plus lisible, ex: if ($user->hasRole('admin')) { ... }
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * FONCTION UTILE : Raccourci pour vérifier si l'utilisateur est un administrateur.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }
}
