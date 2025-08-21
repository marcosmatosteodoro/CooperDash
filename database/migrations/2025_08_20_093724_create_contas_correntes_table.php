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
        Schema::create('contas_correntes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cooperado_id')->constrained()->onDelete('cascade');
            $table->string('numero_conta')->unique();
            $table->decimal('saldo', 15, 2)->default(0);
            $table->decimal('limite_credito', 15, 2)->default(0);
            $table->enum('status', ['ATIVA', 'BLOQUEADA', 'CANCELADA'])->default('ATIVA');
            $table->date('data_abertura');
            $table->date('data_encerramento')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contas_correntes');
    }
};
