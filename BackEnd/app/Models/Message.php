<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle Message
 * 
 * Ce modèle gère les messages envoyés via le formulaire de contact du site.
 * Il permet de stocker les demandes des visiteurs et leur inscription à la newsletter.
 */
class Message extends Model
{
    /**
     * Attributs remplissables.
     */
    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'subscribe'
    ];
}
