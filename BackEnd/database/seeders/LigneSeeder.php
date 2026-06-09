<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Ligne;
use Illuminate\Database\Seeder;

class LigneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Ligne::create([
            'numero' => '45',
            'depart' => 'Adarissa',
            'arrivee' => 'Bab Ftouh',
            'description' => 'Ligne principale centre-ville',
        ]);

        Ligne::create([
            'numero' => '16',
            'depart' => 'Aeroport Fes-Saiss',
            'arrivee' => 'Centre-ville',
            'description' => 'Liaison aéroport - ville nouvelle',
        ]);
    }
}
