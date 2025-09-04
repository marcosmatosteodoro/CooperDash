<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParcelasEmprestimo extends Model
{
    use HasFactory;

    protected $table = 'parcelas_emprestimo';

    protected $fillable = [
        'emprestimo_id',
        'numero_parcela',
        'valor_parcela',
        'data_vencimento',
        'data_pagamento',
        'status',
        'valor_pago',
        'dias_atraso',
        'multa',
        'juros',
    ];

    public static function rules()
    {
        return [
            'emprestimo_id' => 'required|exists:emprestimos,id',
            'numero_parcela' => 'required|integer',
            'valor_parcela' => 'required|numeric',
            'data_vencimento' => 'required|date',
            'data_pagamento' => 'nullable|date',
            'status' => 'required|in:PENDENTE,PAGO,ATRASADO,CANCELADO',
            'valor_pago' => 'required|numeric',
            'dias_atraso' => 'required|integer',
            'multa' => 'required|numeric',
            'juros' => 'required|numeric',
        ];
    }

    public static function messages()
    {
        return [
            'emprestimo_id.required' => 'O campo empréstimo é obrigatório.',
            'emprestimo_id.exists' => 'O empréstimo selecionado não é válido.',
            'numero_parcela.required' => 'O número da parcela é obrigatório.',
            'numero_parcela.integer' => 'O número da parcela deve ser um número inteiro.',
            'valor_parcela.required' => 'O valor da parcela é obrigatório.',
            'valor_parcela.numeric' => 'O valor da parcela deve ser um número.',
            'data_vencimento.required' => 'A data de vencimento é obrigatória.',
            'data_vencimento.date' => 'A data de vencimento deve ser uma data válida.',
            'data_pagamento.date' => 'A data de pagamento deve ser uma data válida.',
            'status.required' => 'O status é obrigatório.',
            'status.in' => 'O status selecionado não é válido.',
            'valor_pago.required' => 'O valor pago é obrigatório.',
            'valor_pago.numeric' => 'O valor pago deve ser um número.',
            'dias_atraso.required' => 'Os dias de atraso são obrigatórios.',
            'dias_atraso.integer' => 'Os dias de atraso devem ser um número inteiro.',
            'multa.required' => 'A multa é obrigatória.',
            'multa.numeric' => 'A multa deve ser um número.',
            'juros.required' => 'Os juros são obrigatórios.',
            'juros.numeric' => 'Os juros devem ser um número.',
        ];
    }
}
