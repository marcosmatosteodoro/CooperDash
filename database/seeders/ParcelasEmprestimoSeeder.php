<?php

namespace Database\Seeders;

use App\Models\ParcelasEmprestimo;
use Illuminate\Database\Seeder;

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
