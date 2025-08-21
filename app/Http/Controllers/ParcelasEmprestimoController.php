<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ParcelasEmprestimo;
use Illuminate\Support\Facades\DB;

class ParcelasEmprestimoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $filters = $request->validate([
            'q' => 'string|min:1',
        ],
        [
            'q.min' => 'A pesquisa deve ter pelo menos 1 caracteres.',
            'q.string' => 'O campo :attribute deve ser um texto.',
        ]);

        $parcelas = ParcelasEmprestimo::query();

        if (!empty($filters['q'])) {
            $q = $filters['q'];

            $parcelas->where(function ($query) use ($q) {
                $query->where('numero_parcela', 'LIKE', "%{$q}%")
                    ->orWhere('valor_parcela', 'LIKE', "%{$q}%")
                    ->orWhere('data_vencimento', 'LIKE', "%{$q}%")
                    ->orWhere('data_pagamento', 'LIKE', "%{$q}%")
                    ->orWhere('status', 'LIKE', "%{$q}%");
            });
        }

        $parcelas = $parcelas
            ->orderBy('data_vencimento', 'asc')
            ->paginate($perPage);

        return response()->json($parcelas, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate(ParcelasEmprestimo::rules(), ParcelasEmprestimo::messages());
            $parcela = ParcelasEmprestimo::create($validated);

            return response()->json($parcela, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erro ao criar parcela', 
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $parcela = ParcelasEmprestimo::find($id);

        if (!$parcela) {
            return response()->json(['message' => 'Parcela não encontrada'], 404);
        }

        return response()->json($parcela, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $parcela = ParcelasEmprestimo::find($id);

            if (!$parcela) {
                return response()->json(['message' => 'Parcela não encontrada'], 404);
            }

            $validated = $request->validate(ParcelasEmprestimo::rules($id), ParcelasEmprestimo::messages());
            $parcela->update($validated);

            return response()->json($parcela);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $parcela = ParcelasEmprestimo::find($id);

        if (!$parcela) {
            return response()->json(['message' => 'Parcela não encontrada'], 404);
        }

        return response()->json(null, 204);
    }
}
