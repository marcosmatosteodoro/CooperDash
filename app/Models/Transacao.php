<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transacao extends Model
{
    use HasFactory;

    protected $table = 'transacoes';

    protected $fillable = [
        'tipo',
        'valor',
        'saldo_anterior',
        'saldo_posterior',
        'descricao',
        'categoria',
        'data_transacao',
        'contas_corrente_id',
    ];

    public static function rules()
    {
        return [
            'tipo' => 'required|string|in:DEPOSITO,SAQUE,TRANSFERENCIA,RENDIMENTO,TAXA',
            'valor' => 'required|numeric|min:0',
            'saldo_anterior' => 'required|numeric|min:0',
            'saldo_posterior' => 'required|numeric|min:0',
            'descricao' => 'required|string|max:255',
            'categoria' => 'required|string|max:255',
            'data_transacao' => 'required|date',
            'contas_corrente_id' => 'required|exists:contas_correntes,id',
        ];
    }

    public static function messages()
    {
        return [
            'tipo.required' => 'O tipo da transação é obrigatório.',
            'tipo.string' => 'O tipo da transação deve ser uma string.',
            'tipo.in' => 'O tipo da transação deve ser um dos seguintes: DEPOSITO, SAQUE, TRANSFERENCIA, RENDIMENTO, TAXA.',
            'valor.required' => 'O valor da transação é obrigatório.',
            'valor.numeric' => 'O valor da transação deve ser um número.',
            'valor.min' => 'O valor da transação deve ser pelo menos 0.',
            'saldo_anterior.required' => 'O saldo anterior é obrigatório.',
            'saldo_anterior.numeric' => 'O saldo anterior deve ser um número.',
            'saldo_anterior.min' => 'O saldo anterior deve ser pelo menos 0.',
            'saldo_posterior.required' => 'O saldo posterior é obrigatório.',
            'saldo_posterior.numeric' => 'O saldo posterior deve ser um número.',
            'saldo_posterior.min' => 'O saldo posterior deve ser pelo menos 0.',
            'descricao.required' => 'A descrição é obrigatória.',
            'descricao.string' => 'A descrição deve ser uma string.',
            'descricao.max' => 'A descrição não pode ter mais de 255 caracteres.',
            'categoria.required' => 'A categoria é obrigatória.',
            'categoria.string' => 'A categoria deve ser uma string.',
            'categoria.max' => 'A categoria não pode ter mais de 255 caracteres.',
            'data_transacao.required' => 'A data da transação é obrigatória.',
            'data_transacao.date' => 'A data da transação deve ser uma data válida.',
            'contas_corrente_id.required' => 'O ID da conta corrente é obrigatório.',
            'contas_corrente_id.exists' => 'O ID da conta corrente deve existir.',
        ];
    }
}
