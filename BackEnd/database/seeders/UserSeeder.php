<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Ahmed Client',
            'email' => 'client@test.com',
            'password' => Hash::make('password'), //Sauvgarder le mot de passe 'password' de manière sécurisée (hashé = lettre aléatoire)
            'role' => 'client',
            'active' => true,
        ]);

        User::create([
            'name' => 'Youssef Chauffeur',
            'email' => 'chauffeur@test.com',
            'password' => Hash::make('password'),
            'role' => 'chauffeur',
            'active' => true,
        ]);

        User::create([
            'name'     => 'Admin',
            'email'    => 'admin@issalfes.ma', // email unique pour admin
            'password' => Hash::make('admin1234'),
            'role'     => 'admin',
            'active'   => true,
        ]);
    }
}
