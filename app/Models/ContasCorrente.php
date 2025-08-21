<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ContasCorrente extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_conta',
        'saldo',
        'limite_credito',
        'status',
        'data_abertura',
        'data_encerramento',
        'cooperado_id'
    ];

    public static function rules()
    {
        return [
            'numero_conta' => 'required|string|max:255|unique:contas_correntes',
            'saldo' => 'required|numeric|min:0',
            'limite_credito' => 'required|numeric|min:0',
            'status' => 'required|in:ATIVA,BLOQUEADA,CANCELADA',
            'data_abertura' => 'required|date',
            'data_encerramento' => 'nullable|date',
            'cooperado_id' => 'required|exists:cooperados,id',
        ];
    }

    public static function messages()
    {
        return [
            'numero_conta.required' => 'O número da conta é obrigatório.',
            'numero_conta.string' => 'O número da conta deve ser uma string.',
            'numero_conta.max' => 'O número da conta não pode ter mais de 255 caracteres.',
            'numero_conta.unique' => 'O número da conta já está em uso.',
            'saldo.required' => 'O saldo é obrigatório.',
            'saldo.numeric' => 'O saldo deve ser um número.',
            'saldo.min' => 'O saldo deve ser pelo menos 0.',
            'limite_credito.required' => 'O limite de crédito é obrigatório.',
            'limite_credito.numeric' => 'O limite de crédito deve ser um número.',
            'limite_credito.min' => 'O limite de crédito deve ser pelo menos 0.',
            'status.required' => 'O status é obrigatório.',
            'status.in' => 'O status deve ser um dos seguintes: ATIVA, BLOQUEADA, CANCELADA.',
            'data_abertura.required' => 'A data de abertura é obrigatória.',
            'data_abertura.date' => 'A data de abertura deve ser uma data válida.',
            'data_encerramento.date' => 'A data de encerramento deve ser uma data válida.',
            'cooperado_id.required' => 'O ID do cooperado é obrigatório.',
            'cooperado_id.exists' => 'O ID do cooperado deve existir.',
        ];
    }
}