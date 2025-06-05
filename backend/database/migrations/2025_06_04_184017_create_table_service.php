<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id(); // Colonne ID auto-incrémentée (BIGINT UNSIGNED)
            $table->string('libelle'); // Nom ou libellé du service

            $table->unsignedBigInteger('division_id'); // Clé étrangère pour la table divisions

            // Définition de la contrainte de clé étrangère
            // S'assure que la table 'divisions' et sa colonne 'id' existent
            // et que la migration de 'divisions' est exécutée AVANT celle-ci.
            $table->foreign('division_id')
                  ->references('id')
                  ->on('divisions')
                  ->onDelete('cascade'); // Ou 'restrict', 'set null' selon votre logique métier
                                         // 'cascade' signifie que si une division est supprimée,
                                         // tous les services associés seront aussi supprimés.

            // Champs de suivi optionnels (comme discuté pour les autres tables)
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            
            $table->timestamps(); // Ajoute les colonnes created_at et updated_at (DATETIME)
            $table->softDeletes(); // Ajoute la colonne deleted_at (DATETIME NULLABLE) pour la suppression douce
        });

        // Optionnel : Si vous voulez ajouter les contraintes pour les champs _by
        // après la création de la table (pour éviter les problèmes de dépendance circulaire
        // si ces champs référencent la table 'users' qui pourrait être créée après).
        // Vous feriez cela dans une migration séparée ou ici si 'users' est déjà créée.
        /*
        Schema::table('services', function (Blueprint $table) {
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('deleted_by')->references('id')->on('users')->onDelete('set null');
        });
        */
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('services');
    }
};
