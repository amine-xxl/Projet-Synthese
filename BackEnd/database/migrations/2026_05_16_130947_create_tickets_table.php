<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ligne_id')->constrained('lignes')->cascadeOnDelete();
            $table->decimal('prix',8,2);
            $table->enum('statut', ['actif', 'utilise', 'annule'])->default('actif');
            $table->timestamp('date_achat')->useCurrent(); //Utiliser les dates currentes lors de l'achat du ticket
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
