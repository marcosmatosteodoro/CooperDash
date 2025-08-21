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
        Schema::create('emprestimos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cooperado_id')->constrained()->onDelete('cascade');
            $table->decimal('valor_solicitado', 15, 2);
            $table->decimal('valor_aprovado', 15, 2)->nullable();
            $table->integer('parcelas');
            $table->decimal('taxa_juros', 5, 2);
            $table->enum('status', ['ANALISE', 'APROVADO', 'REPROVADO', 'LIQUIDADO', 'CANCELADO'])->default('ANALISE');
            $table->text('finalidade');
            $table->date('data_solicitacao');
            $table->date('data_analise')->nullable();
            $table->date('data_liquidacao')->nullable();
            $table->text('observacao')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emprestimos');
    }
};
