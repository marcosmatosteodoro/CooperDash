<?php

namespace Database\Seeders;

use App\Models\Assembleia;
use Illuminate\Database\Seeder;

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
