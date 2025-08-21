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
        Schema::create('cooperados', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->enum('tipo_pessoa', ['FISICA', 'JURIDICA']);
            $table->string('documento')->unique('documento');
            $table->date('data'); // TODO mudar para data_cadastro
            $table->decimal('valor', 10, 2); // TODO mudar para capital_inicial
            $table->string('codigo_pais', 5)->default('+55');
            $table->string('telefone', 15);
            $table->string('email')->nullable();
            $table->enum('status', ['ATIVO', 'INATIVO', 'SUSPENSO'])->default('ATIVO');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cooperados');
    }
};
