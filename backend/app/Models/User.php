<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable // implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'nom',
        'prenom',
        'nom_utilisateur',
        'email',
        'password',
        'num_telephone',
        'cin',
        'role', // Ajout du rôle
        'type_employer_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relation avec EmployeeType (si vous l'utilisez)
    public function employeeType()
    {
        return $this->belongsTo(EmployeeType::class, 'type_employer_id');
    }

    // Relations pour created_by, updated_by, deleted_by
    public function creator() { return $this->belongsTo(User::class, 'created_by'); }
    public function updater() { return $this->belongsTo(User::class, 'updated_by'); }
    public function deleter() { return $this->belongsTo(User::class, 'deleted_by'); }

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

    // Fonctions utiles pour vérifier les rôles (exemple)
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin'); // Supposant que 'admin' est une valeur possible pour le rôle
    }
}
