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
        Schema::create('parcelas_emprestimo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('emprestimo_id')->constrained()->onDelete('cascade');
            $table->integer('numero_parcela');
            $table->decimal('valor_parcela', 10, 2);
            $table->date('data_vencimento');
            $table->date('data_pagamento')->nullable();
            $table->enum('status', ['PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO'])->default('PENDENTE');
            $table->decimal('valor_pago', 10, 2)->default(0);
            $table->integer('dias_atraso')->default(0);
            $table->decimal('multa', 10, 2)->default(0);
            $table->decimal('juros', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parcelas_emprestimo');
    }
};
