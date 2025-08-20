<?php

namespace App\Models;

class CooperadoFisico extends Cooperado
{
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->tipo_pessoa = 'FISICA';
        });
    }

    public static function rules($cooperadoId = null)
    {
        $rules = parent::rules($cooperadoId);

        // Adiciona validação do CPF
        $rules['documento'][] = function ($attribute, $value, $fail) {
            if (!self::validarCPF($value)) {
                $fail('CPF inválido.');
            }
        };

        return $rules;
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
}
