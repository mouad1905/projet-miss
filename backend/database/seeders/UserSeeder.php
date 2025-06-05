<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User; // Assurez-vous que le namespace de votre modèle User est correct
use Illuminate\Support\Facades\Hash; // Pour hacher le mot de passe

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Exemple de création d'un utilisateur administrateur
        User::create([
            'nom' => 'Admin',
            'prenom' => 'Super',
            'nom_utilisateur' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'), // Hachez toujours les mots de passe !
            'num_telephone' => '0600000000',     // Optionnel
            'cin' => 'A123456',                 // Optionnel
            'role' => 'admin',                  // Rôle défini
            'type_employer_id' => null,         // Optionnel, mettez un ID valide si vous utilisez cette table et que c'est pertinent
            'email_verified_at' => now(),       // Marquer l'email comme vérifié si besoin
            // Les champs created_by, updated_by, deleted_by seront gérés par le modèle User
            // si vous avez la logique dans la méthode boot() du modèle.
            // Sinon, vous pourriez les définir ici si nécessaire pour le seeder.
        ]);

        // Exemple de création d'un utilisateur employé
        User::create([
            'nom' => 'Employe',
            'prenom' => 'Standard',
            'nom_utilisateur' => 'employe1',
            'email' => 'employe1@example.com',
            'password' => Hash::make('password123'),
            'num_telephone' => '0611111111',
            'cin' => 'B789012',
            'role' => 'employe',
            'type_employer_id' => null, // Mettez un ID valide si pertinent
            'email_verified_at' => now(),
        ]);

        // Vous pouvez ajouter d'autres utilisateurs ici
        // User::create([...]);

        // Ou utiliser une factory pour générer plusieurs utilisateurs de test
        // \App\Models\User::factory(10)->create(); // Si vous avez configuré une factory UserFactory
    }
}