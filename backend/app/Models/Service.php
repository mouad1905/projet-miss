<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'libelle',
        'division_id',
        // Ajoutez created_by, updated_by, etc. si vous les remplissez manuellement
    ];

    /**
     * Les attributs qui doivent être traités comme des dates.
     */
    protected $dates = ['deleted_at'];

    /**
     * Relation: Un service appartient à une division.
     */
    public function division()
    {
        return $this->belongsTo(Division::class);
    }
}
