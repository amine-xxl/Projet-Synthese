<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle Actualite
 * Ce modèle représente les articles de blog ou les actualités de l'entreprise.
 * C'est un modèle indépendant utilisé pour informer les usagers.
 */
class Actualite extends Model
{
    /**
     * Attributs remplissables.
     */
    protected $fillable = ['titre', 'contenu', 'image'];
}
