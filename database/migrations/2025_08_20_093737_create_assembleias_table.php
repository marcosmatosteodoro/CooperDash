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
        Schema::create('assembleias', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descricao');
            $table->dateTime('data_hora');
            $table->enum('tipo', ['ORDINARIA', 'EXTRAORDINARIA']);
            $table->enum('status', ['AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'])->default('AGENDADA');
            $table->text('pauta');
            $table->text('local');
            $table->text('resultado')->nullable();
            $table->integer('quorum_minimo')->default(0);
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assembleias');
    }
};
