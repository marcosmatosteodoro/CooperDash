<?php

namespace Database\Factories;

use App\Models\Emprestimo;
use App\Models\Cooperado;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmprestimoFactory extends Factory
{
    protected $model = Emprestimo::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['ANALISE', 'APROVADO', 'REPROVADO', 'LIQUIDADO', 'CANCELADO']);
        $dataSolicitacao = $this->faker->dateTimeBetween('-1 year', 'now');
        $dataAnalise = in_array($status, ['APROVADO', 'REPROVADO', 'LIQUIDADO']) ? $this->faker->dateTimeBetween($dataSolicitacao, 'now') : null;
        $dataLiquidacao = $status === 'LIQUIDADO' ? $this->faker->dateTimeBetween($dataAnalise ?? $dataSolicitacao, 'now') : null;

        return [
            'cooperado_id' => Cooperado::factory(), // garante que crie cooperados vinculados
            'valor_solicitado' => $this->faker->randomFloat(2, 500, 50000),
            'valor_aprovado' => $status === 'APROVADO' || $status === 'LIQUIDADO'
                ? $this->faker->randomFloat(2, 500, 50000)
                : null,
            'parcelas' => $this->faker->numberBetween(6, 60),
            'taxa_juros' => $this->faker->randomFloat(2, 0.5, 5),
            'status' => $status,
            'finalidade' => $this->faker->sentence(),
            'data_solicitacao' => $dataSolicitacao,
            'data_analise' => $dataAnalise,
            'data_liquidacao' => $dataLiquidacao,
            'observacao' => $this->faker->boolean(30) ? $this->faker->paragraph() : null,
        ];
    }
}
