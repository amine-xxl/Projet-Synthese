<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle Ticket
 * 
 * Ce modèle représente un titre de transport acheté par un utilisateur.
 * Il lie un utilisateur à une ligne spécifique avec un prix et un statut.
 */
class Ticket extends Model
{
    /**
     * Attributs remplissables.
     */
    protected $fillable = [
        'user_id',
        'ligne_id',
        'prix',
        'statut',
        'date_achat'
    ];

    /**
     * Relation : Un ticket appartient à un seul utilisateur.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation : Un ticket  appartient à une ligne de bus spécifique.
     */
    public function ligne()
    {
        return $this->belongsTo(Ligne::class);
    }
}
