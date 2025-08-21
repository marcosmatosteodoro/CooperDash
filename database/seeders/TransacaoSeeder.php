<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transacao;

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
