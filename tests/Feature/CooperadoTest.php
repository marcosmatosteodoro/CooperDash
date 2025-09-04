<?php

namespace Tests\Feature;

use App\Models\Cooperado;
use App\Models\CooperadoFisico;
use App\Models\CooperadoJuridico;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class CooperadoTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function deve_criar_um_cooperado_valido()
    {
        $cooperado = Cooperado::factory()->create([
            'tipo_pessoa' => 'FISICA',
            'documento' => '52998224725', // CPF válido
            'data' => '1990-01-01',
            'valor' => 2500.00,
            'codigo_pais' => '+55',
            'telefone' => '11987654321',
        ]);

        $this->assertDatabaseHas('cooperados', [
            'id' => $cooperado->id,
            'documento' => '52998224725'
        ]);
    }

    /** @test */
    public function cooperado_fisico_deve_setar_tipo_pessoa_automaticamente()
    {
        $cooperadoFisico = CooperadoFisico::factory()->create();

        $this->assertEquals('FISICA', $cooperadoFisico->tipo_pessoa);
    }

    /** @test */
    public function cooperado_juridico_deve_setar_tipo_pessoa_automaticamente()
    {
        $cooperadoJuridico = CooperadoJuridico::factory()->create();

        $this->assertEquals('JURIDICA', $cooperadoJuridico->tipo_pessoa);
    }

    /** @test */
    public function deve_validar_campos_obrigatorios()
    {
        $validator = Validator::make([], Cooperado::rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('nome', $validator->errors()->toArray());
        $this->assertArrayHasKey('tipo_pessoa', $validator->errors()->toArray());
        $this->assertArrayHasKey('documento', $validator->errors()->toArray());
        $this->assertArrayHasKey('data', $validator->errors()->toArray());
        $this->assertArrayHasKey('valor', $validator->errors()->toArray());
        $this->assertArrayHasKey('codigo_pais', $validator->errors()->toArray());
        $this->assertArrayHasKey('telefone', $validator->errors()->toArray());
    }

    /** @test */
    public function deve_validar_cpf_correto()
    {
        $validator = Validator::make(
            ['documento' => '52998224725'],
            ['documento' => CooperadoFisico::rules()['documento']]
        );

        $this->assertFalse($validator->fails());
    }

    /** @test */
    public function deve_rejeitar_cpf_invalido()
    {
        $validator = Validator::make(
            ['documento' => '111.111.111-11'],
            ['documento' => CooperadoFisico::rules()['documento']]
        );

        $this->assertTrue($validator->fails());
        $this->assertEquals('CPF inválido.', $validator->errors()->first('documento'));
    }

    /** @test */
    public function deve_validar_cnpj_correto()
    {
        $validator = Validator::make(
            ['documento' => '33.014.556/0001-96'],
            ['documento' => CooperadoJuridico::rules()['documento']]
        );

        $this->assertFalse($validator->fails());
    }

    /** @test */
    public function deve_rejeitar_cnpj_invalido()
    {
        $validator = Validator::make(
            ['documento' => '11.111.111/1111-11'],
            ['documento' => CooperadoJuridico::rules()['documento']]
        );

        $this->assertTrue($validator->fails());
        $this->assertEquals('CNPJ inválido.', $validator->errors()->first('documento'));
    }

    /** @test */
    public function deve_rejeitar_data_futura()
    {
        $validator = Validator::make(
            ['data' => now()->addDay()->format('Y-m-d')],
            ['data' => Cooperado::rules()['data']]
        );

        $this->assertTrue($validator->fails());
        $this->assertEquals('A data não pode ser futura.', $validator->errors()->first('data'));
    }

    /** @test */
    public function deve_aceitar_data_passada()
    {
        $validator = Validator::make(
            ['data' => now()->subDay()->format('Y-m-d')],
            ['data' => Cooperado::rules()['data']]
        );

        $this->assertFalse($validator->fails());
    }

    /** @test */
    public function deve_rejeitar_telefone_invalido()
    {
        $validator = Validator::make(
            ['telefone' => 'ABCDE12345'],
            ['telefone' => Cooperado::rules()['telefone']]
        );

        $this->assertTrue($validator->fails());
        $this->assertEquals('O telefone deve conter apenas números.', $validator->errors()->first('telefone'));
    }

    /** @test */
    public function deve_aceitar_email_valido()
    {
        $validator = Validator::make(
            ['email' => 'teste@exemplo.com'],
            ['email' => Cooperado::rules()['email']]
        );

        $this->assertFalse($validator->fails());
    }

    /** @test */
    public function deve_rejeitar_email_invalido()
    {
        $validator = Validator::make(
            ['email' => 'email-invalido'],
            ['email' => Cooperado::rules()['email']]
        );

        $this->assertTrue($validator->fails());
    }

    /** @test */
    public function deve_aceitar_email_nulo()
    {
        $validator = Validator::make(
            ['email' => null],
            ['email' => Cooperado::rules()['email']]
        );

        $this->assertFalse($validator->fails());
    }

    /** @test */
    public function deve_formatar_telefone_completo_corretamente()
    {
        $cooperado = new Cooperado([
            'codigo_pais' => '+55',
            'telefone' => '11987654321'
        ]);

        $this->assertEquals('+5511987654321', $cooperado->telefone_completo);
    }

    /** @test */
    public function deve_garantir_que_documento_e_unico()
    {
        Cooperado::factory()->create([
            'documento' => '12345678901'
        ]);

        $validator = Validator::make(
            ['documento' => '12345678901'],
            ['documento' => Cooperado::rules()['documento']]
        );

        $this->assertTrue($validator->fails());
        $this->assertStringContainsString(
            'Este documento já está em uso por outro cooperado',
            $validator->errors()->first('documento')
        );
    }
}
