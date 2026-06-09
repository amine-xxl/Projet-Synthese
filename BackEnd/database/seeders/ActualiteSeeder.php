<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Actualite;
use Illuminate\Database\Seeder;

class ActualiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Actualite::create([
            'titre' => 'Nouvelle ligne L3 en service',
            'contenu' => 'À partir du 1er juin, la ligne L3 sera opérationnelle.',
            'image' => null,
        ]);
    }
}
