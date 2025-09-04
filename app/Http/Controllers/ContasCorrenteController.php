<?php

namespace App\Http\Controllers;

use App\Models\ContasCorrente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContasCorrenteController extends Controller
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

        $contas = ContasCorrente::query();

        if (! empty($filters['q'])) {
            $q = $filters['q'];

            $contas->where(function ($query) use ($q) {
                $query->where(DB::raw('LOWER(numero_conta)'), 'LIKE', '%'.strtolower($q).'%')
                    ->orWhere('saldo', 'LIKE', "%{$q}%")
                    ->orWhere('limite_credito', 'LIKE', "%{$q}%")
                    ->orWhere('status', 'LIKE', "%{$q}%")
                    ->orWhere('data_abertura', 'LIKE', "%{$q}%")
                    ->orWhere('data_encerramento', 'LIKE', "%{$q}%")
                    ->orWhere('cooperado_id', 'LIKE', "%{$q}%");
            });
        }

        $contas = $contas
            ->orderBy('numero_conta', 'asc')
            ->paginate($perPage);

        return response()->json($contas, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate(ContasCorrente::rules(), ContasCorrente::messages());
            $contas = ContasCorrente::create($validated);

            return response()->json($contas, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erro ao criar conta corrente',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $conta = ContasCorrente::find($id);

        if (! $conta) {
            return response()->json(['message' => 'Conta corrente não encontrada'], 404);
        }

        return response()->json($conta, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $conta = ContasCorrente::find($id);

            if (! $conta) {
                return response()->json(['message' => 'Conta corrente não encontrada'], 404);
            }

            $validated = $request->validate(ContasCorrente::rules($id), ContasCorrente::messages());
            $conta->update($validated);

            return response()->json($conta, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $conta = ContasCorrente::find($id);

        if (! $conta) {
            return response()->json(['message' => 'Conta corrente não encontrada'], 404);
        }

        $conta->delete();

        return response()->json(null, 204);
    }
}
