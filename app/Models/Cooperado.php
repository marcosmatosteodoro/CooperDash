<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cooperado extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'tipo_pessoa',
        'documento',
        'data',
        'valor',
        'codigo_pais',
        'telefone',
        'email'
    ];

    public static function rules($tipoPessoa = null, $cooperadoId = null)
    {
        return [
            'nome' => 'required|string|max:255',
            'tipo_pessoa' => 'required|in:FISICA,JURIDICA',
            'documento' => [
                'required',
                'string',
                function ($attribute, $value, $fail) use ($tipoPessoa, $cooperadoId) {
                    $tipo = $tipoPessoa ?? request()->input('tipo_pessoa');
                    $exists = Cooperado::where('documento', $value)
                        ->when($cooperadoId, fn($q) => $q->where('id', '!=', $cooperadoId))
                        ->exists();

                    if ($exists) {
                        $fail('Este documento já está em uso por outro cooperado.');
                        return;
                    }

                    if ($tipo === 'FISICA' && !self::validarCPF($value)) {
                        $fail('CPF inválido.');
                    } elseif ($tipo === 'JURIDICA' && !self::validarCNPJ($value)) {
                        $fail('CNPJ inválido.');
                    }
                }
            ],
            'data' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    if (strtotime($value) > strtotime('today')) {
                        $fail('A data não pode ser futura.');
                    }
                }
            ],
            'valor' => 'required|numeric|min:0',
            'codigo_pais' => [
                'required',
                'string',
                'max:5',
                'starts_with:+',
                function ($attribute, $value, $fail) {
                    $numeros = substr($value, 1);
                    if (!preg_match('/^[0-9]+$/', $numeros)) {
                        $fail('O código do país deve começar com "+" seguido apenas de números.');
                    }
                }
            ],
            'telefone' => [
                'required',
                'string',
                'min:10',
                'max:15',
                function ($attribute, $value, $fail) {
                    if (!preg_match('/^[0-9]+$/', $value)) {
                        $fail('O telefone deve conter apenas números.');
                    }
                }
            ],
            'email' => 'nullable|email'
        ];
    }

    public function getTelefoneCompletoAttribute()
    {
        return $this->codigo_pais . $this->telefone;
    }

    protected static function validarCPF($cpf)
    {
        $cpf = preg_replace('/[^0-9]/', '', $cpf);

        if (strlen($cpf) != 11) {
            return false;
        }

        if (preg_match('/(\d)\1{10}/', $cpf)) {
            return false;
        }
        
        for ($t = 9; $t < 11; $t++) {
            for ($d = 0, $c = 0; $c < $t; $c++) {
                $d += $cpf[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $d) % 11) % 10;
            if ($cpf[$c] != $d) {
                return false;
            }
        }
        
        return true;
    }

    protected static function validarCNPJ($cnpj)
    {
        $cnpj = preg_replace('/[^0-9]/', '', $cnpj);

        if (strlen($cnpj) != 14) {
            return false;
        }

        $tamanho = strlen($cnpj) - 2;
        $numeros = substr($cnpj, 0, $tamanho);
        $digitos = substr($cnpj, $tamanho);
        $soma = 0;
        $pos = $tamanho - 7;
        
        for ($i = $tamanho; $i >= 1; $i--) {
            $soma += $numeros[$tamanho - $i] * $pos--;
            if ($pos < 2) {
                $pos = 9;
            }
        }
        
        $resultado = $soma % 11 < 2 ? 0 : 11 - $soma % 11;
        if ($resultado != $digitos[0]) {
            return false;
        }
        
        $tamanho++;
        $numeros = substr($cnpj, 0, $tamanho);
        $soma = 0;
        $pos = $tamanho - 7;
        
        for ($i = $tamanho; $i >= 1; $i--) {
            $soma += $numeros[$tamanho - $i] * $pos--;
            if ($pos < 2) {
                $pos = 9;
            }
        }
        
        $resultado = $soma % 11 < 2 ? 0 : 11 - $soma % 11;
        if ($resultado != $digitos[1]) {
            return false;
        }
        
        return true;
    }
}
