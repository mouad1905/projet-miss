<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Service; // Importer le modèle Service pour lier les utilisateurs à un service
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Récupérer un service existant auquel assigner les nouveaux utilisateurs.
        // Cela suppose que votre ServiceSeeder a déjà été exécuté.
        $serviceRH = Service::where('libelle', 'Service des ressources humaines')->first();
        $servicePlanif = Service::where('libelle', 'Service de la planification et urbanisme')->first();
        
        // Créer un utilisateur administrateur
        User::create([
            'nom' => 'Admin',
            'prenom' => 'Super',
            'nom_utilisateur' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'), // Le mot de passe est "password"
            'num_telephone' => '0600000000',
            'cin' => 'A100000',
            'role' => 'admin',
            // Assigner l'ID du service RH, ou null si le service n'est pas trouvé
            'service_id' => $serviceRH ? $serviceRH->id : null,
            'email_verified_at' => now(),
        ]);

        // Créer un utilisateur employé
        User::create([
            'nom' => 'Employe',
            'prenom' => 'Standard',
            'nom_utilisateur' => 'employe1',
            'email' => 'employe1@example.com',
            'password' => Hash::make('password123'), // Le mot de passe est "password123"
            'num_telephone' => '0611111111',
            'cin' => 'B200000',
            'role' => 'employe',
            // Assigner l'ID du service de planification, ou null s'il n'est pas trouvé
            'service_id' => $servicePlanif ? $servicePlanif->id : null,
            'email_verified_at' => now(),
        ]);

        // Vous pouvez utiliser une factory pour créer plus d'utilisateurs de test si nécessaire
        // \App\Models\User::factory(10)->create();
    }
}
