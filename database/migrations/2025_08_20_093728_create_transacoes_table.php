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
        Schema::create('transacoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contas_corrente_id')->constrained()->onDelete('cascade');
            $table->enum('tipo', ['DEPOSITO', 'SAQUE', 'TRANSFERENCIA', 'RENDIMENTO', 'TAXA']);
            $table->decimal('valor', 15, 2);
            $table->decimal('saldo_anterior', 15, 2);
            $table->decimal('saldo_posterior', 15, 2);
            $table->string('descricao');
            $table->string('categoria');
            $table->timestamp('data_transacao')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transacoes');
    }
};
