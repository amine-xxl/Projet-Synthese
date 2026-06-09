<?php

namespace Database\Seeders;

use App\Models\Message;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Message::create([
            'name' => 'Jean Dupont',
            'email' => 'jean.dupont@example.com',
            'subject' => 'Retard d\'un bus',
            'message' => 'Bonjour, je voudrais savoir si la ligne 1 circule le dimanche ? Merci.',
            'subscribe' => true,
        ]);

        Message::create([
            'name' => 'Marie Curie',
            'email' => 'marie.curie@example.com',
            'subject' => 'Autre',
            'message' => 'J\'ai perdu mon sac dans le bus de la ligne 3 hier soir vers 18h.',
            'subscribe' => false,
        ]);
    }
}
