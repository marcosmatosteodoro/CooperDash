<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Emprestimo;
use Illuminate\Support\Facades\DB;

class EmprestimoController extends Controller
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

        $emprestimo = Emprestimo::query();

        if (!empty($filters['q'])) {
            $q = $filters['q'];

            $emprestimo->where(function ($query) use ($q) {
                $query->where(DB::raw('LOWER(finalidade)'), 'LIKE', '%' . strtolower($q) . '%')
                    ->orWhere('status', 'LIKE', "%{$q}%")
                    ->orWhere('valor_solicitado', 'LIKE', "%{$q}%")
                    ->orWhere('valor_aprovado', 'LIKE', "%{$q}%");
            });
        }

        $emprestimo = $emprestimo
            ->orderBy('created_at', 'asc')
            ->paginate($perPage);

        return response()->json($emprestimo, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate(Emprestimo::rules(), Emprestimo::messages());
            $emprestimo = Emprestimo::create($validated);

            return response()->json($emprestimo, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erro ao criar empréstimo',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $emprestimo = Emprestimo::find($id);

        if (!$emprestimo) {
            return response()->json(['message' => 'Empréstimo não encontrado'], 404);
        }

        return response()->json($emprestimo, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $emprestimo = Emprestimo::find($id);

            if (!$emprestimo) {
                return response()->json(['message' => 'Empréstimo não encontrado'], 404);
            }

            $validated = $request->validate(Emprestimo::rules($id), Emprestimo::messages());
            $emprestimo->update($validated);

            return response()->json($emprestimo);
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
        $emprestimo = Emprestimo::find($id);

        if (!$emprestimo) {
            return response()->json(['message' => 'Empréstimo não encontrado'], 404);
        }

        $emprestimo->delete();

        return response()->json(null, 204);
    }
}

