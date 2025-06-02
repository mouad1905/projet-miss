<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_divisions_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('divisions', function (Blueprint $table) {
            $table->id();
            $table->string('libelle');
            // Laravel gère CreatedAt et LastUpdatedAt avec timestamps()
            // mais si vous voulez des noms exacts comme demandé :
            $table->timestamp('CreatedAt')->nullable()->useCurrent(); // Ou ->nullable(false) si toujours requis
            $table->string('CreatedBy')->nullable(); // TEXT est souvent string ou text en Laravel
            $table->timestamp('LastUpdatedAt')->nullable();
            $table->string('LastUpdatedBy')->nullable();
            // Pour DeletedAt, Laravel utilise softDeletes()
            $table->softDeletes('DeletedAt'); // Ajoute une colonne DeletedAt DATETIME(6) NULLABLE
            $table->string('DeletedBy')->nullable();
            // Si vous n'utilisez pas timestamps() de Laravel, et que CreatedAt/LastUpdatedAt ne doivent pas être nullables :
            // $table->dropColumn(['created_at', 'updated_at']); // Si timestamps() a été appelé par erreur avant
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('divisions');
    }
};