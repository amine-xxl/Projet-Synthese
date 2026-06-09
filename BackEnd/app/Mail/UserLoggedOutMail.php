<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;

class UserLoggedOutMail extends Mailable
{
    // Cette propriete contient l'utilisateur qui vient de se deconnecter.
    public User $user;

    public function __construct(User $user)
    {
        // On garde l'utilisateur dans la classe pour l'utiliser dans la vue.
        $this->user = $user;
    }

    public function build()
    {
        // subject() definit le sujet de l'email.
        // view() choisit la vue Blade qui contient le texte de l'email.
        return $this->subject('Deconnexion de votre compte Issal Fes')
            ->view('emails.user_logged_out');
    }
}
