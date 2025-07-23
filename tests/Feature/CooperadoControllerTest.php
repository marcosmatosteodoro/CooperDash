<?php

namespace Tests\Feature;

use App\Models\Cooperado;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CooperadoControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /** @test */
    public function pode_listar_todos_cooperados()
    {
        Cooperado::factory()->count(3)->create();

        $response = $this->getJson('/api/cooperados');

        $response->assertStatus(200)
            ->assertJsonCount(3)
            ->assertJsonStructure([
                '*' => ['id', 'nome', 'tipo_pessoa', 'documento', 'data', 'valor', 'telefone']
            ]);
    }

    /** @test */
    public function pode_criar_um_novo_cooperado_pessoa_fisica()
    {
        $data = [
            'nome' => $this->faker->name,
            'tipo_pessoa' => 'FISICA',
            'documento' => '529.982.247-25', // CPF válido
            'data' => '1990-01-01',
            'valor' => 2500.00,
            'codigo_pais' => '+55',
            'telefone' => '11987654321',
            'email' => $this->faker->safeEmail
        ];

        $response = $this->postJson('/api/cooperados', $data);

        $response->assertStatus(201)
            ->assertJson($data);
    }

    /** @test */
    public function nao_pode_criar_cooperado_com_documento_invalido()
    {
        $data = [
            'nome' => $this->faker->name,
            'tipo_pessoa' => 'FISICA',
            'documento' => '111.111.111-11', // CPF inválido
            'data' => '1990-01-01',
            'valor' => 2500.00,
            'codigo_pais' => '+55',
            'telefone' => '11987654321',
            'email' => $this->faker->safeEmail
        ];

        $response = $this->postJson('/api/cooperados', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['documento']);
    }

    /** @test */
    public function pode_visualizar_um_cooperado_especifico()
    {
        $cooperado = Cooperado::factory()->create();

        $response = $this->getJson("/api/cooperados/{$cooperado->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $cooperado->id,
                'nome' => $cooperado->nome
            ]);
    }

    /** @test */
    public function retorna_404_ao_visualizar_cooperado_inexistente()
    {
        $response = $this->getJson('/api/cooperados/9999');

        $response->assertStatus(404);
    }

    /** @test */
    public function pode_atualizar_um_cooperado()
    {
        $cooperado = Cooperado::factory()->create([
            'tipo_pessoa' => 'FISICA',
            'documento' => '529.982.247-25'
        ]);

        $novosDados = [
            'nome' => 'Novo Nome',
            'tipo_pessoa' => 'FISICA',
            'documento' => '529.982.247-25', // Mesmo documento (deve permitir)
            'data' => '1991-01-01',
            'valor' => 3000.00,
            'codigo_pais' => '+55',
            'telefone' => '11999999999',
            'email' => 'novo@email.com'
        ];

        $response = $this->putJson("/api/cooperados/{$cooperado->id}", $novosDados);

        $response->assertStatus(200)
            ->assertJson($novosDados);
    }

    /** @test */
    public function nao_pode_atualizar_para_documento_em_uso_por_outro_cooperado()
    {
        $cooperado1 = Cooperado::factory()->create(['documento' => '111.111.111-11']);
        $cooperado2 = Cooperado::factory()->create(['documento' => '222.222.222-22']);

        $response = $this->putJson("/api/cooperados/{$cooperado2->id}", [
            'documento' => '111.111.111-11' // Documento já usado por cooperado1
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['documento']);
    }

    /** @test */
    public function pode_remover_um_cooperado()
    {
        $cooperado = Cooperado::factory()->create();

        $response = $this->deleteJson("/api/cooperados/{$cooperado->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('cooperados', ['id' => $cooperado->id]);
    }

    /** @test */
    public function retorna_404_ao_remover_cooperado_inexistente()
    {
        $response = $this->deleteJson('/api/cooperados/9999');

        $response->assertStatus(404);
    }

    /** @test */
    public function valida_campos_obrigatorios_ao_criar_cooperado()
    {
        $response = $this->postJson('/api/cooperados', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'nome', 'tipo_pessoa', 'documento', 'data', 
                'valor', 'codigo_pais', 'telefone'
            ]);
    }
}
