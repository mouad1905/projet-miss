<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('libelle');
            $table->text('description')->nullable();
            $table->string('unite_mesure')->nullable();
            $table->decimal('cout_unitaire', 10, 2)->nullable();
            $table->integer('seuil_expiration_jours')->nullable();
            $table->integer('seuil_rupture_stock')->nullable();
            
            // Le type de consommable et de stockage sont de simples chaînes de caractères
            $table->string('type_consommable')->nullable();
            $table->string('type_stockage')->nullable();

            // Clé étrangère SEULEMENT pour la catégorie d'article
            $table->foreignId('article_category_id')->nullable()->constrained()->onDelete('set null');
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('articles');
    }
};
