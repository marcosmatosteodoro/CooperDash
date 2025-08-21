<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\CooperadosSeeder;
use Database\Seeders\EnderecoSeeder;
use Database\Seeders\ContasCorrenteSeeder;
use Database\Seeders\TransacaoSeeder;
use Database\Seeders\EmprestimoSeeder;
use Database\Seeders\ParcelasEmprestimoSeeder;
use Database\Seeders\AssembleiaSeeder;
use Database\Seeders\VotacaoSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CooperadosSeeder::class,
            EnderecoSeeder::class,
            ContasCorrenteSeeder::class,
            TransacaoSeeder::class,
            EmprestimoSeeder::class,
            ParcelasEmprestimoSeeder::class,
            AssembleiaSeeder::class,
            VotacaoSeeder::class,
        ]);
    }
}
