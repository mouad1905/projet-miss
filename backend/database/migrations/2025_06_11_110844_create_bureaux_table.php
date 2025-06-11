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
        Schema::create('bureaux', function (Blueprint $table) {
            $table->id();
            $table->string('libelle');
            $table->string('abreviation')->nullable();
            
            $table->unsignedBigInteger('service_id');

            // Définition de la contrainte de clé étrangère
            // Assurez-vous que la table 'services' existe déjà
            $table->foreign('service_id')
                  ->references('id')
                  ->on('services')
                  ->onDelete('cascade'); // Si un service est supprimé, ses bureaux le sont aussi

            // Champs de suivi optionnels
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            
            $table->timestamps(); // created_at, updated_at
            $table->softDeletes(); // deleted_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bureaux');
    }
};
