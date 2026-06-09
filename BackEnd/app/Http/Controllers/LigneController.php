<?php

namespace App\Http\Controllers;

use App\Models\Ligne;
use App\Models\Itineraire;
use Illuminate\Http\Request;

/**
 * LigneController
 * Gère la gestion des lignes de bus et de leurs arrêts (itineraires).
 */
class LigneController extends Controller
{
    /**
     * ── Afficher la liste des lignes avec leurs itinéraires ──
     * Récupère toutes les lignes en incluant leurs arrêts triés par ordre logique.
     */
    public function index()
    {
        return response()->json(Ligne::with('itineraires')->get());
    }

    /**
     * ── Créer une nouvelle ligne et ses arrêts ──
     * Reçoit les infos de base ainsi que deux tableaux (aller et retour) pour les arrêts.
     */
    public function store(Request $request)
    {
        // Validation des données : le numéro de ligne doit être unique
        $request->validate([
            'numero'      => 'required|unique:lignes',
            'depart'      => 'required',
            'arrivee'     => 'required',
            'prix'        => 'required|numeric|min:0',
            'description' => 'required',
            'arrets_aller'  => 'nullable|array',
            'arrets_retour' => 'nullable|array',
        ]);

        // 1. Création de l'entité Ligne
        $ligne = Ligne::create([
            'numero'      => $request->numero,
            'depart'      => $request->depart,
            'arrivee'     => $request->arrivee,
            'prix'        => $request->prix,
            'description' => $request->description,
        ]);

        // 2. Boucle pour enregistrer chaque arrêt du trajet ALLER
        if ($request->has('arrets_aller')) {
            foreach ($request->arrets_aller as $index => $nom_arret) { // $index pour l'ordre des arrêts $nom_arret pour le nom de l'arrêt
                if (!empty($nom_arret)) {
                    Itineraire::create([
                        'ligne_id'  => $ligne->id,
                        'direction' => 'aller',
                        'nom_arret' => $nom_arret,
                        'ordre'     => $index + 1, // On stocke la position car les arrêts doivent être affichés dans l'ordre défini par l'admin
                    ]);
                }
            }
        }

        // 3. Boucle pour enregistrer chaque arrêt du trajet RETOUR
        if ($request->has('arrets_retour')) {
            foreach ($request->arrets_retour as $index => $nom_arret) {
                if (!empty($nom_arret)) {
                    Itineraire::create([
                        'ligne_id'  => $ligne->id,
                        'direction' => 'retour',
                        'nom_arret' => $nom_arret,
                        'ordre'     => $index + 1,
                    ]);
                }
            }
        }

        // Retourne la ligne complète avec ses relations chargées
        return response()->json($ligne->load('itineraires'), 201);
    }

    /**
     * ── Afficher une ligne précise avec ses itinéraires ──
     */
    public function show(Ligne $ligne)
    {
        return response()->json($ligne->load('itineraires'));
    }

    /**
     * ── Mettre à jour une ligne et ses arrêts ──
     * Pour simplifier la mise à jour des arrêts, on supprime les anciens et on recrée les nouveaux.
     */
    public function update(Request $request, Ligne $ligne)
    {
        $request->validate([
            'numero'      => 'required|unique:lignes,numero,' . $ligne->id,
            'depart'      => 'required',
            'arrivee'     => 'required',
            'prix'        => 'required|numeric|min:0',
            'description' => 'required',
            'arrets_aller'  => 'nullable|array',
            'arrets_retour' => 'nullable|array',
        ]);

        // 1. Mise à jour des informations générales de la ligne
        $ligne->update([
            'numero'      => $request->numero,
            'depart'      => $request->depart,
            'arrivee'     => $request->arrivee,
            'prix'        => $request->prix,
            'description' => $request->description,
        ]);

        // 2. Suppression des anciens itinéraires pour faire place aux nouveaux
        $ligne->itineraires()->delete();

        // 3. Création des nouveaux arrêts ALLER
        if ($request->has('arrets_aller')) {
            foreach ($request->arrets_aller as $index => $nom_arret) {
                if (!empty($nom_arret)) {
                    Itineraire::create([
                        'ligne_id'  => $ligne->id,
                        'direction' => 'aller',
                        'nom_arret' => $nom_arret,
                        'ordre'     => $index + 1,
                    ]);
                }
            }
        }

        // 4. Création des nouveaux arrêts RETOUR
        if ($request->has('arrets_retour')) {
            foreach ($request->arrets_retour as $index => $nom_arret) {
                if (!empty($nom_arret)) {
                    Itineraire::create([
                        'ligne_id'  => $ligne->id,
                        'direction' => 'retour',
                        'nom_arret' => $nom_arret,
                        'ordre'     => $index + 1,
                    ]);
                }
            }
        }

        return response()->json($ligne->load('itineraires'));
    }

    /**
     * ── Supprimer une ligne ──
     * La suppression de la ligne entraînera automatiquement celle de ses itinéraires via la base de données.
     */
    public function destroy(Ligne $ligne)
    {
        $ligne->delete();
        return response()->json(['message' => 'Ligne supprimée avec succès']);
    }
}
