<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Assembleia;

class AssembleiaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Assembleia::factory()->count(70)->create();
    }
}
