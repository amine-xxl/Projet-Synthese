<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ligne;
use App\Models\Itineraire;

class ItineraireSeeder extends Seeder
{
    /**
     * ── Seeder pour remplir la table itineraires ──
     */
    public function run(): void
    {
        // On récupère quelques lignes existantes (L01, L02...)
        // Assurez-vous que LigneSeeder a déjà été exécuté
        $lignes = Ligne::all();

        if ($lignes->isEmpty()) {
            return;
        }

        foreach ($lignes as $ligne) {
            
            // --- Données exemples pour l'ALLER ---
            $arretsAller = [
                "Place Atlas",
                "Hay Saada",
                "Ecole Al Imam",
                "Rond Point Marjane"
            ];

            foreach ($arretsAller as $index => $nom) {
                Itineraire::create([
                    'ligne_id'  => $ligne->id,
                    'direction' => 'aller',
                    'nom_arret' => $nom,
                    'ordre'     => $index + 1,
                ]);
            }

            // --- Données exemples pour le RETOUR ---
            $arretsRetour = [
                "Avenue Hassan II",
                "Gare ONCF",
                "Clinique El Kawthar"
            ];

            foreach ($arretsRetour as $index => $nom) {
                Itineraire::create([
                    'ligne_id'  => $ligne->id,
                    'direction' => 'retour',
                    'nom_arret' => $nom,
                    'ordre'     => $index + 1,
                ]);
            }
        }
    }
}
