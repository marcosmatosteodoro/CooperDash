<?php

namespace Lang\PTBR;

return [
    'required' => 'O campo :attribute é obrigatório.',
    'string' => 'O campo :attribute deve ser um texto.',
    'max' => [
        'string' => 'O campo :attribute não pode ter mais que :max caracteres.',
    ],
    'in' => 'O valor selecionado para :attribute é inválido.',
    'unique' => 'O campo :attribute já está em uso.',
    'date' => 'O campo :attribute deve ser uma data válida.',
    'numeric' => 'O campo :attribute deve ser numérico.',
    'min' => [
        'numeric' => 'O valor mínimo para :attribute é :min.',
        'string' => 'O campo :attribute deve ter pelo menos :min caracteres.',
    ],
    'email' => 'O campo :attribute deve ser um endereço de e-mail válido.',

    'custom' => [
        'documento' => [
            'required' => 'O documento é obrigatório.',
        ],
        'telefone' => [
            'regex' => 'O telefone deve conter apenas números.',
        ],
    ],

    'attributes' => [
        'nome' => 'Nome',
        'tipo_pessoa' => 'Tipo de Pessoa',
        'documento' => 'Documento',
        'data' => 'Data',
        'valor' => 'Valor',
        'codigo_pais' => 'Código do País',
        'telefone' => 'Telefone',
        'email' => 'E-mail',
        'q' => 'Pesquisa',
    ],
];
