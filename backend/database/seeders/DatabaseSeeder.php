<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Appelez vos seeders ici
        $this->call([
            UserSeeder::class,
            // EmployeeTypeSeeder::class, // Si vous avez un seeder pour les types d'employés
            // D'autres seeders que vous pourriez avoir...
        ]);
    }
}