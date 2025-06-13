<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('demandes', function (Blueprint $table) {
            // Statut de la livraison: 'En attente de livraison', 'Livré', 'Reçu', 'Non reçu'
            $table->string('statut_livraison')->default('En attente de livraison')->after('status');
        });
    }

    public function down()
    {
        Schema::table('demandes', function (Blueprint $table) {
            $table->dropColumn('statut_livraison');
        });
    }
};
