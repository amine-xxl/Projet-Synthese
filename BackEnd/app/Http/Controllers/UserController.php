<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * Contrôleur UserController
 *
 * Permet aux utilisateurs de gérer leurs informations personnelles.
 */
class UserController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
        ], [
            'name.required' => 'Le nom est obligatoire.',
            'name.max'      => 'Le nom ne doit pas dépasser 100 caractères.',
        ]);

        $user = $request->user();
        $user->update(['name' => $request->name]);
        return response()->json(['user' => $user]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required', // Le mot de passe actuel est nécessaire pour vérifier l'identité de l'utilisateur
            'password'         => 'required|min:6|confirmed', // Le nouveau mot de passe doit être confirmé pour éviter les erreurs de saisie
        ], [
            'current_password.required' => 'Le mot de passe actuel est obligatoire.',
            'password.required'         => 'Le nouveau mot de passe est obligatoire.',
            'password.min'              => 'Le nouveau mot de passe doit faire au moins 6 caractères.',
            'password.confirmed'        => 'La confirmation du mot de passe ne correspond pas.',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect.',
            ], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json(['message' => 'Mot de passe modifié avec succès.']);
    }
}
