<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ParcelasEmprestimo;

class ParcelasEmprestimoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ParcelasEmprestimo::factory()->count(150)->create();
    }
}
