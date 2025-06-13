<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('demandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('article_id')->constrained()->onDelete('cascade');
            $table->integer('quantite_demandee');
            $table->date('date_demande');
            $table->string('status')->default('En cours'); // Statut par défaut
            
            // Champs pour la gestion admin (peuvent rester null pour une demande utilisateur)
            $table->integer('quantite_retournee')->nullable();
            $table->integer('quantite_restante')->nullable();
            $table->text('objet_marche')->nullable();
            $table->string('reference_marche')->nullable();
            $table->foreignId('fournisseur_id')->nullable()->constrained()->onDelete('set null');
            $table->string('fichier_path')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('demandes');
    }
};
