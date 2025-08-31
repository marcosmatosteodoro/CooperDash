<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transacao;
use Illuminate\Support\Facades\DB;

class TransacaoController extends Controller
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

        $transacoes = Transacao::query();

        if (!empty($filters['q'])) {
            $q = $filters['q'];

            $transacoes->where(function ($query) use ($q) {
                $query->where(DB::raw('LOWER(descricao)'), 'LIKE', '%' . strtolower($q) . '%')
                    ->orWhere('categoria', 'LIKE', "%{$q}%")
                    ->orWhere('data_transacao', 'LIKE', "%{$q}%")
                    ->orWhere('valor', 'LIKE', "%{$q}%");
            });
        }

        $transacoes = $transacoes
            ->orderBy('data_transacao', 'asc')
            ->paginate($perPage);

        return response()->json($transacoes, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate(Transacao::rules(), Transacao::messages());
            $transacao = Transacao::create($validated);
            return response()->json($transacao, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erro ao criar transação', 
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $transacao = Transacao::find($id);

        if (!$transacao) {
            return response()->json(['message' => 'Transação não encontrada'], 404);
        }

        return response()->json($transacao, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $transacao = Transacao::find($id);

            if (!$transacao) {
                return response()->json(['message' => 'Transação não encontrada'], 404);
            }

            $validated = $request->validate(Transacao::rules($id), Transacao::messages());
            $transacao->update($validated);

            return response()->json($transacao);
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
        $transacao = Transacao::find($id);

        if (!$transacao) {
            return response()->json(['message' => 'Transação não encontrada'], 404);
        }

        $transacao->delete();

        return response()->json(null, 204);
    }
}
