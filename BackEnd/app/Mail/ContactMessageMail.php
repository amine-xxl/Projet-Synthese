<?php

namespace App\Mail;

use App\Models\Message;
use Illuminate\Mail\Mailable;

class ContactMessageMail extends Mailable
{
    // Cette propriete contient le message envoye depuis le formulaire contact.
    public Message $messageContact;

    public function __construct(Message $messageContact)
    {
        // On stocke le message recu depuis le controleur dans $this->messageContact.
        // Le nom messageContact evite la confusion avec le champ "message" de la table.
        $this->messageContact = $messageContact;
    }

    public function build()
    {
        // subject() definit le sujet de l'email.
        // view() choisit la vue Blade qui contient le texte de l'email.
        return $this->subject('Votre message a ete recu - Issal Fes')
            ->view('emails.contact_message');
    }
}
