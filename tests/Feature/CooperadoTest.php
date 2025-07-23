<?php

namespace Tests\Feature;

use App\Models\Cooperado;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Testing\WithFaker;
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
            'documento' => '52998224725' // Deve salvar sem formatação
        ]);
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
        $data = [
            'tipo_pessoa' => 'FISICA',
            'documento' => '529.982.247-25' // CPF válido
        ];

        $validator = Validator::make($data, [
            'documento' => Cooperado::rules()['documento']
        ]);

        $this->assertFalse($validator->fails());
    }

    /** @test */
    public function deve_rejeitar_cpf_invalido()
    {
        $data = [
            'tipo_pessoa' => 'FISICA',
            'documento' => '111.111.111-11' // CPF inválido
        ];

        $rules = Cooperado::rules('FISICA');

        $validator = Validator::make($data, [
            'documento' => $rules['documento']
        ]);

        $this->assertTrue($validator->fails());
        $this->assertEquals('CPF inválido.', $validator->errors()->first('documento'));
    }

    /** @test */
    public function deve_validar_cnpj_correto()
    {
        $data = [
            'tipo_pessoa' => 'JURIDICA',
            'documento' => '33.014.556/0001-96' // CNPJ válido
        ];

        $rules = Cooperado::rules('JURIDICA');

        $validator = Validator::make($data, [
            'documento' => $rules['documento']
        ]);

        $this->assertFalse($validator->fails());
    }

    /** @test */
    public function deve_rejeitar_cnpj_invalido()
    {
        $data = [
            'tipo_pessoa' => 'JURIDICA',
            'documento' => '11.111.111/1111-11' // CNPJ inválido
        ];

        $rules = Cooperado::rules('JURIDICA');

        $validator = Validator::make($data, [
            'documento' => $rules['documento']
        ]);

        $this->assertTrue($validator->fails());
        $this->assertEquals('CNPJ inválido.', $validator->errors()->first('documento'));
    }

    /** @test */
    public function deve_rejeitar_data_futura()
    {
        $data = [
            'data' => now()->addDay()->format('Y-m-d') // Data de amanhã
        ];

        $validator = Validator::make($data, [
            'data' => Cooperado::rules()['data']
        ]);

        $this->assertTrue($validator->fails());
        $this->assertEquals('A data não pode ser futura.', $validator->errors()->first('data'));
    }

    /** @test */
    public function deve_aceitar_data_passada()
    {
        $data = [
            'data' => now()->subDay()->format('Y-m-d') // Data de ontem
        ];

        $validator = Validator::make($data, [
            'data' => Cooperado::rules()['data']
        ]);

        $this->assertFalse($validator->fails());
    }

    /** @test */
    public function deve_rejeitar_telefone_invalido()
    {
        $data = [
            'telefone' => 'ABCDE12345' // Telefone inválido
        ];

        $validator = Validator::make($data, [
            'telefone' => Cooperado::rules()['telefone']
        ]);

        $this->assertTrue($validator->fails());
        $this->assertEquals('O telefone deve conter apenas números.', $validator->errors()->first('telefone'));
    }

    /** @test */
    public function deve_aceitar_email_valido()
    {
        $data = [
            'email' => 'teste@exemplo.com'
        ];

        $validator = Validator::make($data, [
            'email' => Cooperado::rules()['email']
        ]);

        $this->assertFalse($validator->fails());
    }

    /** @test */
    public function deve_rejeitar_email_invalido()
    {
        $data = [
            'email' => 'email-invalido'
        ];

        $validator = Validator::make($data, [
            'email' => Cooperado::rules()['email']
        ]);

        $this->assertTrue($validator->fails());
    }

    /** @test */
    public function deve_aceitar_email_nulo()
    {
        $data = [
            'email' => null
        ];

        $validator = Validator::make($data, [
            'email' => Cooperado::rules()['email']
        ]);

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
        // Cria um cooperado com um documento específico
        $cooperadoExistente = Cooperado::create([
            'nome' => 'Teste',
            'tipo_pessoa' => 'FISICA',
            'documento' => '12345678901',
            'data' => '1990-01-01',
            'valor' => 1000,
            'codigo_pais' => '+55',
            'telefone' => '11987654321',
        ]);

        // Tenta criar outro com o mesmo documento
        $validator = Validator::make(
            [
                'tipo_pessoa' => 'FISICA',
                'documento' => '12345678901' // Mesmo documento
            ],
            [
                'documento' => Cooperado::rules()['documento']
            ]
        );

        $this->assertTrue($validator->fails());
        $this->assertStringContainsString('Este documento já está em uso por outro cooperado', $validator->errors()->first('documento'));
    }
}
