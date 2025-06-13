<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('nom_utilisateur')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('num_telephone')->nullable()->unique();
            $table->string('cin')->nullable()->unique();
            

            // Colonne pour le rôle (par exemple : 'admin', 'employe', 'manager')
            $table->string('role')->default('employe'); // Mettez une valeur par défaut si pertinent

            $table->unsignedBigInteger('type_employer_id')->nullable();
            // Optionnel: Clé étrangère si vous avez une table employee_types
            // Assurez-vous que la migration de employee_types s'exécute avant
            /*
            $table->foreign('type_employer_id')
                  ->references('id')
                  ->on('employee_types')
                  ->onDelete('set null');
            */

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->rememberToken();
            $table->timestamps(); // created_at, updated_at
            $table->softDeletes(); // deleted_at (colonne pour la suppression douce)
        });

        // Si vous voulez ajouter les contraintes de clé étrangère pour les champs _by après la création de la table
        // (par exemple, si vous avez des problèmes de dépendances circulaires ou si vous le faites dans une migration séparée)
        /*
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('deleted_by')->references('id')->on('users')->onDelete('set null');
        });
        */
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
