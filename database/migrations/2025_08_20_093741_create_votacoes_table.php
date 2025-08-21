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
        Schema::create('votacoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assembleia_id')->constrained()->onDelete('cascade');
            $table->foreignId('cooperado_id')->constrained()->onDelete('cascade');
            $table->enum('voto', ['FAVOR', 'CONTRA', 'ABSTENCAO']);
            $table->timestamp('data_voto')->useCurrent();
            $table->text('justificativa')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votacoes');
    }
};
