<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Assembleia extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descricao',
        'data_hora',
        'tipo',
        'status',
        'pauta',
        'local',
        'resultado',
        'quorum_minimo',
    ];

    public static function rules()
    {
        return [
            'titulo' => 'required|string|max:255',
            'descricao' => 'required|string',
            'data_hora' => 'required|date',
            'tipo' => 'required|in:ORDINARIA,EXTRAORDINARIA',
            'status' => 'required|in:AGENDADA,EM_ANDAMENTO,CONCLUIDA,CANCELADA',
            'pauta' => 'required|string',
            'local' => 'required|string',
            'resultado' => 'nullable|string',
            'quorum_minimo' => 'required|integer|min:0',
        ];
    }

    public static function messages()
    {
        return [
            'titulo.required' => 'O título é obrigatório.',
            'titulo.string' => 'O título deve ser uma string.',
            'titulo.max' => 'O título não pode ter mais de 255 caracteres.',
            'descricao.required' => 'A descrição é obrigatória.',
            'descricao.string' => 'A descrição deve ser uma string.',
            'data_hora.required' => 'A data e hora são obrigatórias.',
            'data_hora.date' => 'A data e hora devem ser uma data válida.',
            'tipo.required' => 'O tipo é obrigatório.',
            'tipo.in' => 'O tipo deve ser um dos seguintes: ORDINARIA, EXTRAORDINARIA.',
            'status.required' => 'O status é obrigatório.',
            'status.in' => 'O status deve ser um dos seguintes: AGENDADA, EM_ANDAMENTO, CONCLUIDA, CANCELADA.',
            'pauta.required' => 'A pauta é obrigatória.',
            'pauta.string' => 'A pauta deve ser uma string.',
            'local.required' => 'O local é obrigatório.',
            'local.string' => 'O local deve ser uma string.',
            'resultado.string' => 'O resultado deve ser uma string.',
            'quorum_minimo.required' => 'O quórum mínimo é obrigatório.',
            'quorum_minimo.integer' => 'O quórum mínimo deve ser um número inteiro.',
            'quorum_minimo.min' => 'O quórum mínimo deve ser pelo menos 0.',
        ];
    }
}
