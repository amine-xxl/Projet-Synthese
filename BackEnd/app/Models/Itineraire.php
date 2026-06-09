<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle Itineraire
 * 
 * Ce modèle représente un arrêt spécifique (station) faisant partie du trajet d'une ligne.
 * Il permet de définir le parcours exact d'un bus.
 */
class Itineraire extends Model
{
    /**
     * Attributs remplissables.
     */
    protected $fillable = [
        'ligne_id',
        'direction',
        'nom_arret',
        'ordre',
    ];

    /**
     * Relation : Chaque arrêt appartient à une et une seule ligne.
     */
    public function ligne()
    {
        return $this->belongsTo(Ligne::class);
    }
}
