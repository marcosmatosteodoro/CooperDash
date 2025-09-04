<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

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
