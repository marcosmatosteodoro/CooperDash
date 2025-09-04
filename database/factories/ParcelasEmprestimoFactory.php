<?php

namespace Database\Factories;

use App\Models\Emprestimo;
use App\Models\ParcelasEmprestimo;
use Illuminate\Database\Eloquent\Factories\Factory;

class ParcelasEmprestimoFactory extends Factory
{
    protected $model = ParcelasEmprestimo::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO']);
        $dataVencimento = $this->faker->dateTimeBetween('now', '+1 year');
        $dataPagamento = null;
        $diasAtraso = 0;
        $valorPago = 0;
        $multa = 0;
        $juros = 0;

        if ($status === 'PAGO') {
            $dataPagamento = $this->faker->dateTimeBetween('-1 month', 'now');
            $valorPago = $this->faker->randomFloat(2, 100, 5000);
        } elseif ($status === 'ATRASADO') {
            $diasAtraso = $this->faker->numberBetween(1, 60);
            $multa = $this->faker->randomFloat(2, 10, 500);
            $juros = $this->faker->randomFloat(2, 5, 300);
        }

        return [
            'emprestimo_id' => Emprestimo::factory(),
            'numero_parcela' => $this->faker->numberBetween(1, 60),
            'valor_parcela' => $this->faker->randomFloat(2, 100, 5000),
            'data_vencimento' => $dataVencimento,
            'data_pagamento' => $dataPagamento,
            'status' => $status,
            'valor_pago' => $valorPago,
            'dias_atraso' => $diasAtraso,
            'multa' => $multa,
            'juros' => $juros,
        ];
    }
}
