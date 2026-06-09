<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessageMail;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

/**
 * Controleur MessageController
 * Gere les messages envoyes depuis le formulaire de contact du FrontEnd.
 */
class MessageController extends Controller
{
    /**
     * Enregistre un message de contact dans la base de donnees
     * puis envoie un email de confirmation a l'utilisateur.
     */
    public function store(Request $request)
    {
        // validate() verifie les champs envoyes par React.
        // Si un champ est invalide, Laravel retourne automatiquement une erreur 422.
        $request->validate([
            'name'    => 'required|string|max:100',
            'email'   => 'required|email',
            'subject' => 'required|string',
            'message' => 'required|string',
        ], [
            'name.required'    => 'Le nom est obligatoire.',
            'email.required'   => "L'email est obligatoire.",
            'email.email'      => "L'email n'est pas valide.",
            'subject.required' => 'Le sujet est obligatoire.',
            'message.required' => 'Le message est obligatoire.',
        ]);

        // Message::create() enregistre le message dans la table messages.
        // $request->all() contient les champs recus depuis le formulaire.
        // On garde le resultat dans $message pour l'utiliser dans l'email.
        $message = Message::create($request->all());

        // Mail::to() indique l'adresse email du destinataire.
        // Ici, le destinataire est la personne qui a rempli le formulaire.
        // ContactMessageMail prepare le contenu de l'email avec le message enregistre.
        Mail::to($message->email)->send(new ContactMessageMail($message));

        // response()->json() renvoie une reponse claire au FrontEnd.
        return response()->json(['message' => 'Message envoye avec succes !'], 201);
    }

    /**
     * Liste tous les messages.
     * Cette methode est utilisee par l'administrateur.
     */
    public function index()
    {
        // latest() trie les messages du plus recent au plus ancien.
        // get() execute la requete et recupere les messages.
        $messages = Message::latest()->get();

        // On retourne la liste au format JSON.
        return response()->json($messages);
    }

    /**
     * Supprime un message.
     * Cette methode est utilisee par l'administrateur.
     */
    public function destroy(Message $message)
    {
        // delete() supprime la ligne correspondante dans la table messages.
        $message->delete();

        // On confirme la suppression au FrontEnd.
        return response()->json(['message' => 'Message supprime avec succes.']);
    }
}
