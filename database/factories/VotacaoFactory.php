<?php

namespace Database\Factories;

use App\Models\Assembleia;
use App\Models\Cooperado;
use App\Models\Votacao;
use Illuminate\Database\Eloquent\Factories\Factory;

class VotacaoFactory extends Factory
{
    protected $model = Votacao::class;

    public function definition(): array
    {
        return [
            'assembleia_id' => Assembleia::factory(), // cria assembleia se não existir
            'cooperado_id' => Cooperado::factory(),   // cria cooperado se não existir
            'voto' => $this->faker->randomElement(['FAVOR', 'CONTRA', 'ABSTENCAO']),
            'data_voto' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'justificativa' => $this->faker->optional()->sentence(10),
        ];
    }
}
