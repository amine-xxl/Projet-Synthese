<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\ProInfo;
use Illuminate\Database\Seeder;

class ProInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProInfo::create([
            'user_id' => 2,
            'ligne_id' => 1,
            'numero_bus' => '1034',
            'modele' => 'Yutong ZK6126HG',
            'capacite' => 45,
            'trajet' => 'Adarissa → Bab Ftouh → Centre Ville',
            'tarif' => 5.00,
        ]);

        ProInfo::create([
            'user_id' => 2,
            'ligne_id' => 2,
            'numero_bus' => '2054',
            'modele' => 'Yutong ZK6126HG',
            'capacite' => 15,
            'trajet' => 'Adarissa → Route Ain Chkef → Centre Ville',
            'tarif' => 5.00,
        ]);
    }
}
