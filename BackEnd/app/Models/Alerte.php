<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle Alerte
 * 
 * Ce modèle gère les notifications d'incidents ou de perturbations sur les lignes.
 * Exemples : Travaux, Retards, Déviations.
 */
class Alerte extends Model
{
    /**
     * Attributs remplissables.
     */
    protected $fillable = ['ligne_id', 'type', 'message', 'statut'];

    /**
     * Relation : Une alerte appartient toujours à une ligne de bus spécifique.
     */
    public function ligne()
    {
        return $this->belongsTo(Ligne::class);
    }
}
