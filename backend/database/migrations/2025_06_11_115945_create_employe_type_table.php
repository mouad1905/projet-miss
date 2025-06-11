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
        Schema::create('employee_types', function (Blueprint $table) {
            $table->id(); // Colonne 'id' auto-incrémentée, clé primaire
            $table->string('libelle')->unique(); // Nom du type d'employeur, ex: "Fonctionnaire"
            
            // Vous pouvez ajouter les champs de suivi si vous en avez besoin pour cette table aussi
            // $table->unsignedBigInteger('created_by')->nullable();
            // $table->unsignedBigInteger('updated_by')->nullable();
            // $table->unsignedBigInteger('deleted_by')->nullable();
            
            $table->timestamps(); // Ajoute les colonnes 'created_at' et 'updated_at'
            $table->softDeletes(); // Ajoute la colonne 'deleted_at' pour la suppression douce
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employee_types');
    }
};