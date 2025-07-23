<?php

namespace Database\Factories;

use App\Models\Cooperado;
use Illuminate\Database\Eloquent\Factories\Factory;

class CooperadoFactory extends Factory
{
    protected $model = Cooperado::class;

    public function definition()
    {
        return [
            'nome' => $this->faker->name,
            'tipo_pessoa' => 'FISICA',
            'documento' => $this->faker->numerify('###########'), // CPF válido
            'data' => $this->faker->date(),
            'valor' => $this->faker->randomFloat(2, 1000, 10000),
            'codigo_pais' => '+55',
            'telefone' => $this->faker->numerify('###########'),
            'email' => $this->faker->safeEmail,
        ];
    }

    public function pessoaJuridica()
    {
        return $this->state(function (array $attributes) {
            return [
                'tipo_pessoa' => 'JURIDICA',
                'documento' => $this->faker->numerify('##############'), // CNPJ válido
            ];
        });
    }
}
