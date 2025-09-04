<?php

namespace Database\Factories;

use App\Models\CooperadoFisico;
use Illuminate\Database\Eloquent\Factories\Factory;

class CooperadoFisicoFactory extends Factory
{
    protected $model = CooperadoFisico::class;

    public function definition(): array
    {
        return [
            'nome' => $this->faker->name,
            'tipo_pessoa' => 'FISICA', // fixo para cooperado físico
            'documento' => $this->faker->numerify('###########'), // CPF (somente números)
            'data' => $this->faker->date(),
            'valor' => $this->faker->randomFloat(2, 1000, 10000),
            'codigo_pais' => '+55',
            'telefone' => $this->faker->numerify('###########'),
            'email' => $this->faker->safeEmail,
        ];
    }
}
