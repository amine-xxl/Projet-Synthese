<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle Ligne
 * Ce modèle représente une ligne de transport (ex: Ligne 15).
 * Il contient les informations de base comme le numéro, le départ et l'arrivée.
 */
class Ligne extends Model
{
    /**
     * Les champs que l'on peut remplir via le contrôleur.
     */
    protected $fillable = ['numero', 'depart', 'arrivee', 'prix', 'description'];

    /**
     * Relation : Une ligne peut être contenir plusieurs tickets vendus.
     */
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Relation : Une ligne peut avoir plusieurs alertes (ex: retard, panne...).
     */
    public function alertes()
    {
        return $this->hasMany(Alerte::class);
    }

    /**
     * Relation : Une ligne est assignée à plusieurs informations professionnelles de chauffeurs.
     */
    public function proInfos()
    {
        return $this->hasMany(ProInfo::class);
    }

    /**
     * Relation : Une ligne possède plusieurs arrêts (arrêt 1, arrêt 2, ...).
     * On trie les arrêts par le champ 'ordre' pour respecter la séquence du trajet.
     */
    public function itineraires()
    {
        return $this->hasMany(Itineraire::class)->orderBy('ordre');
    }
}
