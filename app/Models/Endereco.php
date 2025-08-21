<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Endereco extends Model
{
    use HasFactory;

    protected $fillable = [
        'cooperado_id',
        'cep',
        'logradouro',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'estado',
        'tipo',
        'principal'
    ];

    public static function rules()
    {
        return [
            'cooperado_id' => 'required|exists:cooperados,id',
            'cep' => 'required|string|max:8',
            'logradouro' => 'required|string|max:255',
            'numero' => 'required|string|max:10',
            'complemento' => 'nullable|string|max:255',
            'bairro' => 'required|string|max:100',
            'cidade' => 'required|string|max:100',
            'estado' => 'required|string|max:2',
            'tipo' => 'required|string|in:residencial,comercial,cobranca',
            'principal' => 'required|boolean',
        ];
    }

    public static function messages()
    {
        return [
            'cooperado_id.required' => 'O campo cooperado é obrigatório.',
            'cooperado_id.exists' => 'O cooperado selecionado não existe.',
            'cep.required' => 'O campo CEP é obrigatório.',
            'cep.max' => 'O campo CEP deve ter no máximo 8 caracteres.',
            'logradouro.required' => 'O campo logradouro é obrigatório.',
            'logradouro.max' => 'O campo logradouro deve ter no máximo 255 caracteres.',
            'numero.required' => 'O campo número é obrigatório.',
            'numero.max' => 'O campo número deve ter no máximo 10 caracteres.',
            'complemento.max' => 'O campo complemento deve ter no máximo 255 caracteres.',
            'bairro.required' => 'O campo bairro é obrigatório.',
            'bairro.max' => 'O campo bairro deve ter no máximo 100 caracteres.',
            'cidade.required' => 'O campo cidade é obrigatório.',
            'cidade.max' => 'O campo cidade deve ter no máximo 100 caracteres.',
            'estado.required' => 'O campo estado é obrigatório.',
            'estado.max' => 'O campo estado deve ter no máximo 2 caracteres.',
            'tipo.required' => 'O campo tipo é obrigatório.',
            'tipo.in' => 'O campo tipo deve ser um dos seguintes valores: residencial, comercial, cobranca.',
            'principal.required' => 'O campo principal é obrigatório.',
            'principal.boolean' => 'O campo principal deve ser verdadeiro ou falso.',
        ];
    }
}
