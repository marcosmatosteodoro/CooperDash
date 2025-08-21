<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Emprestimo;

class EmprestimoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Emprestimo::factory()->count(200)->create();
    }
}
