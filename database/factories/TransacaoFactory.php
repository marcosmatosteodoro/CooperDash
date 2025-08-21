<?php

namespace Database\Factories;

use App\Models\Transacao;
use App\Models\ContasCorrente;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransacaoFactory extends Factory
{
    protected $model = Transacao::class;

    public function definition(): array
    {
        $tipo = $this->faker->randomElement(['DEPOSITO', 'SAQUE', 'TRANSFERENCIA', 'RENDIMENTO', 'TAXA']);
        $valor = $this->faker->randomFloat(2, 10, 5000);
        $saldoAnterior = $this->faker->randomFloat(2, 100, 10000);
        $saldoPosterior = $saldoAnterior;

        if ($tipo === 'DEPOSITO' || $tipo === 'RENDIMENTO') {
            $saldoPosterior += $valor;
        } elseif (in_array($tipo, ['SAQUE', 'TAXA', 'TRANSFERENCIA'])) {
            $saldoPosterior -= $valor;
        }

        return [
            'contas_corrente_id' => ContasCorrente::factory(),
            'tipo' => $tipo,
            'valor' => $valor,
            'saldo_anterior' => $saldoAnterior,
            'saldo_posterior' => $saldoPosterior,
            'descricao' => $this->faker->sentence(4),
            'categoria' => $this->faker->randomElement(['Alimentação', 'Transporte', 'Salário', 'Investimento', 'Serviços']),
            'data_transacao' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
