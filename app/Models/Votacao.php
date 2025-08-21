<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Votacao extends Model
{
    use HasFactory;

    protected $table = 'votacoes';

    protected $fillable = [
        'assembleia_id',
        'cooperado_id',
        'voto',
        'data_voto',
        'justificativa',
    ];

    public static function rules()
    {
        return [
            'assembleia_id' => 'required|exists:assembleias,id',
            'cooperado_id' => 'required|exists:cooperados,id',
            'voto' => 'required|in:FAVOR,CONTRA,ABSTENCAO',
            'data_voto' => 'required|date',
            'justificativa' => 'nullable|string|max:255',
        ];
    }

    public static function messages()
    {
        return [
            'assembleia_id.required' => 'O campo assembleia_id é obrigatório.',
            'assembleia_id.exists' => 'A assembleia selecionada é inválida.',
            'cooperado_id.required' => 'O campo cooperado_id é obrigatório.',
            'cooperado_id.exists' => 'O cooperado selecionado é inválido.',
            'voto.required' => 'O campo voto é obrigatório.',
            'voto.in' => 'O campo voto deve ser um dos seguintes valores: FAVOR, CONTRA, ABSTENCAO.',
            'data_voto.required' => 'O campo data_voto é obrigatório.',
            'data_voto.date' => 'O campo data_voto deve ser uma data válida.',
            'justificativa.string' => 'O campo justificativa deve ser uma string.',
            'justificativa.max' => 'O campo justificativa não pode ter mais de 255 caracteres.',
        ];
    }
}