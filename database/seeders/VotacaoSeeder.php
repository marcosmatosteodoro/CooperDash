<?php

namespace Database\Seeders;

use App\Models\Votacao;
use Illuminate\Database\Seeder;

class VotacaoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Gerar 20 votações fake
        Votacao::factory()->count(200)->create();
    }
}
