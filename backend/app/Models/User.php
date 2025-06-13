<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'nom', 'prenom', 'nom_utilisateur', 'email', 'password',
        'num_telephone', 'cin', 'role', 'service_id', 'type_employer_id',
        'created_by', 'updated_by', 'deleted_by',
    ];

    protected $hidden = ['password', 'remember_token'];
    protected $casts = ['email_verified_at' => 'datetime', 'password' => 'hashed'];

    /**
     * RELATION : Un utilisateur appartient à un service.
     * C'est cette fonction qui permet à Laravel de faire le lien pour 'user.service'.
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * RELATION : Un utilisateur est lié à un bureau.
     * Cette relation est nécessaire si vous voulez afficher le bureau de l'utilisateur.
     * Note: Assurez-vous d'avoir une colonne 'bureau_id' dans votre table 'users'.
     * Si un utilisateur est lié à un service et non directement à un bureau, cette relation
     * devrait peut-être être retirée et la logique adaptée. Pour l'instant, je la commente.
     */
    // public function bureau()
    // {
    //     return $this->belongsTo(Bureau::class);
    // }

    /**
     * RELATION : Un utilisateur appartient à un type d'employeur.
     */
    public function employeeType()
    {
        return $this->belongsTo(EmployeeType::class, 'type_employer_id');
    }
    
    /**
     * RELATION : Un utilisateur a plusieurs demandes.
     */
    public function demandes()
    {
        return $this->hasMany(Demande::class);
    }

    // ... (vos autres relations comme creator, updater, etc.)
}
