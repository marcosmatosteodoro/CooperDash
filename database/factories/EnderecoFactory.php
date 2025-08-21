<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Endereco;
use App\Models\Cooperado;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Endereco>
 */
class EnderecoFactory extends Factory
{
    protected $model = Endereco::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cooperado_id' => Cooperado::factory(),
            'cep' => $this->faker->numerify('########'), // 8 dígitos
            'logradouro' => $this->faker->streetName(),
            'numero' => $this->faker->buildingNumber(),
            'complemento' => $this->faker->optional()->secondaryAddress(),
            'bairro' => $this->faker->streetSuffix(),
            'cidade' => $this->faker->city(),
            'estado' => strtoupper($this->faker->lexify('??')), // 2 letras
            'tipo' => $this->faker->randomElement(['RESIDENCIAL', 'COMERCIAL', 'COBRANCA']),
            'principal' => $this->faker->boolean(30), // 30% de chance de ser principal
        ];
    }
}
