<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Emprestimo extends Model
{
    use HasFactory;

    protected $fillable = [
        'cooperado_id',
        'valor_solicitado',
        'valor_aprovado',
        'parcelas',
        'taxa_juros',
        'status',
        'finalidade',
        'data_solicitacao',
        'data_analise',
        'data_liquidacao',
        'observacao',
    ];

    public static function rules()
    {
        return [
            'cooperado_id' => 'required|exists:cooperados,id',
            'valor_solicitado' => 'required|numeric|min:0',
            'valor_aprovado' => 'nullable|numeric|min:0',
            'parcelas' => 'required|integer|min:1',
            'taxa_juros' => 'required|numeric|min:0',
            'status' => 'required|in:ANALISE,APROVADO,REPROVADO,LIQUIDADO,CANCELADO',
            'finalidade' => 'required|string|max:255',
            'data_solicitacao' => 'required|date',
            'data_analise' => 'nullable|date',
            'data_liquidacao' => 'nullable|date',
            'observacao' => 'nullable|string|max:1000',
        ];
    }

    public static function messages()
    {
        return [
            'cooperado_id.required' => 'O campo cooperado é obrigatório.',
            'cooperado_id.exists' => 'O cooperado selecionado não existe.',
            'valor_solicitado.required' => 'O campo valor solicitado é obrigatório.',
            'valor_solicitado.numeric' => 'O campo valor solicitado deve ser um número.',
            'valor_solicitado.min' => 'O campo valor solicitado deve ser maior ou igual a 0.',
            'valor_aprovado.numeric' => 'O campo valor aprovado deve ser um número.',
            'valor_aprovado.min' => 'O campo valor aprovado deve ser maior ou igual a 0.',
            'parcelas.required' => 'O campo parcelas é obrigatório.',
            'parcelas.integer' => 'O campo parcelas deve ser um número inteiro.',
            'parcelas.min' => 'O campo parcelas deve ser maior ou igual a 1.',
            'taxa_juros.required' => 'O campo taxa de juros é obrigatório.',
            'taxa_juros.numeric' => 'O campo taxa de juros deve ser um número.',
            'taxa_juros.min' => 'O campo taxa de juros deve ser maior ou igual a 0.',
            'status.required' => 'O campo status é obrigatório.',
            'status.in' => 'O campo status deve ser um dos seguintes: ANALISE, APROVADO, REPROVADO, LIQUIDADO, CANCELADO.',
            'finalidade.required' => 'O campo finalidade é obrigatório.',
            'finalidade.string' => 'O campo finalidade deve ser uma string.',
            'finalidade.max' => 'O campo finalidade deve ter no máximo 255 caracteres.',
            'data_solicitacao.required' => 'O campo data de solicitação é obrigatório.',
            'data_solicitacao.date' => 'O campo data de solicitação deve ser uma data válida.',
            'data_analise.date' => 'O campo data de análise deve ser uma data válida.',
            'data_liquidacao.date' => 'O campo data de liquidação deve ser uma data válida.',
            'observacao.string' => 'O campo observação deve ser uma string.',
            'observacao.max' => 'O campo observação deve ter no máximo 1000 caracteres.',
        ];
    }
}
