<?php

namespace App\Http\Controllers;

use App\Mail\UserLoggedInMail;
use App\Mail\UserLoggedOutMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

/**
 * Controleur AuthController
 * Gere l'inscription, la connexion et la deconnexion avec Laravel Sanctum.
 */
class AuthController extends Controller
{
    public function register(Request $request)
    {
        // validate() verifie les donnees envoyees par le formulaire d'inscription.
        // Si une regle n'est pas respectee, Laravel retourne automatiquement une erreur.
        $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
            'role'     => 'in:client,chauffeur,admin',
        ], [
            'name.required'     => 'Veuillez Entrer Votre Nom !',
            'name.string'       => 'Votre Nom Ne Doit Pas Contenir Des Nombres !',
            'name.max'          => 'Votre Nom Doit Etre Moins De 100 Caracteres !',
            'email.required'    => 'Veuillez Entrer Votre Email !',
            'email.email'       => 'Veuillez Entrer Un Email Valide !',
            'email.unique'      => 'Cet Email Existe Deja, Veuillez En Entrer Un Autre !',
            'password.required' => 'Veuillez Entrer Votre Mot De Passe !',
            'password.min'      => "Veuillez Entrer Un Mot De Passe D'Au Moins 6 Caracteres !",
            'password.confirmed'=> 'Veuillez Confirmer Votre Mot De Passe !',
        ]);

        // User::create() ajoute un nouvel utilisateur dans la table users.
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password), // Hash::make() crypte le mot de passe.
            'role'     => $request->role ?? 'client',     // Si aucun role n'est donne, on met client.
            'active'   => true,                           // Le compte est actif par defaut.
        ]);

        // createToken() cree un token Sanctum pour connecter directement l'utilisateur.
        $token = $user->createToken('auth_token')->plainTextToken;

        // On retourne l'utilisateur et le token au FrontEnd.
        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        // On verifie que l'email et le mot de passe sont bien envoyes.
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ], [
            'email.required'    => 'Veuillez Entrer Votre Email !',
            'email.email'       => 'Veuillez Entrer Un Email Valide !',
            'password.required' => 'Veuillez Entrer Votre Mot De Passe !',
        ]);

        // On cherche l'utilisateur qui possede cet email.
        $user = User::where('email', $request->email)->first();

        // Hash::check() compare le mot de passe saisi avec le mot de passe crypte.
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        // Si les identifiants sont corrects, on cree un nouveau token Sanctum.
        $token = $user->createToken('auth_token')->plainTextToken;

        // Mail::to() indique l'adresse email du destinataire.
        // Ici, on envoie un email a l'utilisateur qui vient de se connecter.
        // UserLoggedInMail prepare le contenu de l'email.
        Mail::to($user->email)->send(new UserLoggedInMail($user));

        // On retourne l'utilisateur et le token au FrontEnd.
        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        // $request->user() recupere l'utilisateur connecte grace au token Sanctum.
        $user = $request->user();

        // On envoie un email pour confirmer que la session est terminee.
        Mail::to($user->email)->send(new UserLoggedOutMail($user));

        // currentAccessToken() recupere le token utilise dans cette requete.
        // delete() supprime ce token pour terminer la session cote backend.
        $request->user()->currentAccessToken()->delete();

        // On retourne une reponse simple au FrontEnd.
        return response()->json([
            'message' => 'Deconnexion reussie',
        ]);
    }
}
