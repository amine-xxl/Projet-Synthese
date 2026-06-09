<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle ProInfo
 * 
 * Ce modèle stocke les informations professionnelles des chauffeurs.
 * Il permet de lier un chauffeur (User) à un bus et à une ligne régulière.
 */
class ProInfo extends Model
{
    /**
     * Attributs remplissables.
     */
    protected $fillable = [
        'user_id',
        'ligne_id',
        'numero_bus',
        'modele',
        'capacite',
        'trajet',
        'tarif'
    ];

    /**
     * Relation : Ces informations appartiennent à un seul utilisateur (chauffeur).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation : Le chauffeur est affecté à une ligne spécifique.
     */
    public function ligne()
    {
        return $this->belongsTo(Ligne::class);
    }
}
