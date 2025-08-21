<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Votacao;

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
