<?php

namespace Database\Factories;

use App\Models\CooperadoJuridico;
use Illuminate\Database\Eloquent\Factories\Factory;

class CooperadoJuridicoFactory extends Factory
{
    protected $model = CooperadoJuridico::class;

    public function definition(): array
    {
        return [
            'nome' => $this->faker->company,
            'tipo_pessoa' => 'JURIDICA', // fixo para cooperado jurídico
            'documento' => $this->faker->numerify('##############'), // CNPJ (somente números)
            'data' => $this->faker->date(),
            'valor' => $this->faker->randomFloat(2, 5000, 20000),
            'codigo_pais' => '+55',
            'telefone' => $this->faker->numerify('###########'),
            'email' => $this->faker->companyEmail,
        ];
    }
}
