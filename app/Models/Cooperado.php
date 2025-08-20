<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cooperado extends Model
{
    use HasFactory;

    protected $table = 'cooperados';
    
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

    public static function rules($cooperadoId = null)
    {
        return [
            'nome' => 'required|string|max:255',
            'tipo_pessoa' => 'required|in:FISICA,JURIDICA',
            'documento' => [
                'required',
                'string',
                function ($attribute, $value, $fail) use ($cooperadoId) {
                    $exists = Cooperado::where('documento', $value)
                        ->when($cooperadoId, fn($q) => $q->where('id', '!=', $cooperadoId))
                        ->exists();

                    if ($exists) {
                        $fail('Este documento já está em uso por outro cooperado.');
                        return;
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

    public static function messages()
    {
        return [
            'nome.required' => 'O nome é obrigatório.',
            'tipo_pessoa.required' => 'O tipo de pessoa é obrigatório.',
            'tipo_pessoa.in' => 'O tipo de pessoa deve ser FISICA ou JURIDICA.',
            'documento.required' => 'O documento é obrigatório.',
            'data.required' => 'A data é obrigatória.',
            'data.date' => 'A data deve ser válida.',
            'data.before_or_equal' => 'A data não pode ser futura.',
            'valor.required' => 'O valor é obrigatório.',
            'valor.numeric' => 'O valor deve ser numérico.',
            'codigo_pais.required' => 'O código do país é obrigatório.',
            'telefone.required' => 'O telefone é obrigatório.',
            'telefone.numeric' => 'O telefone deve conter apenas números.',
            'email.email' => 'Informe um e-mail válido.',
        ];
    }
    
    public function getTelefoneCompletoAttribute()
    {
        return $this->codigo_pais . $this->telefone;
    }
}
