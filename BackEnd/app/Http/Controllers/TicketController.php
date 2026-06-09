<?php

namespace App\Http\Controllers;

use App\Models\Ligne;
use App\Models\Ticket;
use Illuminate\Http\Request;

/**
 * Contrôleur TicketController
 * Gère le cycle de vie des tickets (achat, validation, historique).
 */
class TicketController extends Controller
{
    /**
     * Liste les tickets de l'utilisateur connecté.
     */
    public function index(Request $request)
    {
        return response()->json($request->user()->tickets()->with('ligne')->get()); // Affiche les tickets de l'utilisateur connecté avec les infos de la ligne associée
    }

    /**
     * Enregistre l'achat virtuel d'un nouveau ticket.
     */
    public function store(Request $request)
    {
        // Validation des données : ligne_id est requis et doit exister
        $request->validate([
            'ligne_id' => 'required|exists:lignes,id',
        ]);

        // On récupère la ligne pour obtenir son prix actuel
        $ligne = Ligne::findOrFail($request->ligne_id);

        // Création du ticket pour l'utilisateur authentifié (via Sanctum)
        $ticket = Ticket::create([
            'user_id'    => $request->user()->id,
            'ligne_id'   => $ligne->id,
            'prix'       => $ligne->prix,
            'statut'     => 'actif',
            'date_achat' => now(),
        ]);

        // Retourne le ticket créé avec les infos de la ligne
        return response()->json($ticket->load('ligne'), 201);
    }

    /**
     * Affiche un ticket spécifique.
     */
    public function show(Ticket $ticket)
    {
        return response()->json($ticket->load('ligne'));
    }

    /**
     * Met à jour le statut d'un ticket (ex: marqué comme 'utilisé').
     */
    public function update(Request $request, Ticket $ticket)
    {
        $ticket->update($request->all());
        return response()->json($ticket);
    }

    /**
     * Supprime ou annule un ticket.
     */
    public function destroy(Ticket $ticket)
    {
        $ticket->delete();
        return response()->json(['message' => 'Ticket supprimé']);
    }
}
