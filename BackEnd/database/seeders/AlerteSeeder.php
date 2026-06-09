<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Alerte;
use Illuminate\Database\Seeder;

class AlerteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Alerte pour la Ligne 1
        Alerte::create([
            'ligne_id' => 1,
            'type'     => 'retard',
            'message'  => 'Retard de 15 minutes sur la ligne L1 suite à un accident près de Bab Ftouh.',
            'statut'   => 'active',
        ]);

        // Alerte pour la Ligne 2
        Alerte::create([
            'ligne_id' => 2,
            'type'     => 'perturbation',
            'message'  => 'Travaux sur la route de l\'Aéroport, déviation par le quartier Marjane.',
            'statut'   => 'active',
        ]);

        // Alerte générale ou info
        Alerte::create([
            'ligne_id' => 1,
            'type'     => 'info',
            'message'  => 'Nouveaux horaires d\'été applicables dès lundi prochain.',
            'statut'   => 'active',
        ]);
    }
}
