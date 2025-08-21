<?php

namespace Database\Factories;

use App\Models\Assembleia;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssembleiaFactory extends Factory
{
    protected $model = Assembleia::class;

    public function definition(): array
    {
        return [
            'titulo' => $this->faker->sentence(3),
            'descricao' => $this->faker->paragraph(),
            'data_hora' => $this->faker->dateTimeBetween('+1 days', '+1 year'),
            'tipo' => $this->faker->randomElement(['ORDINARIA', 'EXTRAORDINARIA']),
            'status' => $this->faker->randomElement(['AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA']),
            'pauta' => $this->faker->sentence(6),
            'local' => $this->faker->address(),
            'resultado' => $this->faker->optional()->sentence(),
            'quorum_minimo' => $this->faker->numberBetween(10, 200),
        ];
    }
}
