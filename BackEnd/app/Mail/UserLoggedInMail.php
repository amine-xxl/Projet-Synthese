<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;

class UserLoggedInMail extends Mailable
{
    // Cette propriete contient l'utilisateur qui vient de se connecter.
    // Elle est publique pour etre utilisee directement dans la vue Blade.
    public User $user;

    public function __construct(User $user)
    {
        // On stocke l'utilisateur recu depuis le controleur  dans la propriété $user.
        $this->user = $user;
    }

    public function build()
    {
        // subject() definit le sujet affiche dans la boite mail.
        // view() indique le fichier Blade utilise pour construire le message.
        return $this->subject('Connexion a votre compte Issal Fes')
            ->view('emails.user_logged_in');
    }
}
