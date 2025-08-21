<?php

namespace Database\Factories;

use App\Models\ContasCorrente;
use App\Models\Cooperado;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContasCorrente>
 */
class ContasCorrenteFactory extends Factory
{
    protected $model = ContasCorrente::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'numero_conta' => $this->faker->unique()->bankAccountNumber(),
            'saldo' => $this->faker->randomFloat(2, 0, 10000),
            'limite_credito' => $this->faker->randomFloat(2, 500, 5000),
            'status' => $this->faker->randomElement(['ATIVA', 'BLOQUEADA', 'CANCELADA']),
            'data_abertura' => $this->faker->dateTimeBetween('-5 years', 'now'),
            'data_encerramento' => $this->faker->optional(0.2)->dateTimeBetween('-1 years', 'now'),
            'cooperado_id' => Cooperado::factory(),
        ];
    }
}
