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
        Schema::create('demandes', function (Blueprint $table) {
            $table->id();
            
            // Qui a fait la demande
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Quel article est demandé
            $table->foreignId('article_id')->constrained()->onDelete('cascade');
            
            $table->integer('quantite_demandee');
            $table->date('date_demande');
            
            // Statut de la demande (par défaut "En cours")
            $table->string('status')->default('En cours');
            
            // Champs pour la gestion par l'administrateur
            $table->text('objet_marche')->nullable();
            $table->string('reference_marche')->nullable();
            $table->foreignId('fournisseur_id')->nullable()->constrained()->onDelete('set null');
            $table->string('fichier_path')->nullable(); // Pour le QR code ou autre fichier
            
            $table->timestamps();
            $table->softDeletes(); // Pour la suppression douce
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('demandes');
    }
};
