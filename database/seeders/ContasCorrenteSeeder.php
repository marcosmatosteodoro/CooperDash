<?php

namespace Database\Seeders;

use App\Models\ContasCorrente;
use Illuminate\Database\Seeder;

class ContasCorrenteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ContasCorrente::factory()->count(60)->create();
    }
}
