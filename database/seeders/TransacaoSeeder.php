<?php

namespace Database\Seeders;

use App\Models\Transacao;
use Illuminate\Database\Seeder;

class TransacaoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cria 50 transações
        Transacao::factory()->count(150)->create();
    }
}
