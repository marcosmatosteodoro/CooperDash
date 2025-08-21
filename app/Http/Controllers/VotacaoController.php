<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Votacao;
use Illuminate\Support\Facades\DB;

class VotacaoController extends Controller
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

        $votacoes = Votacao::query();

        if (!empty($filters['q'])) {
            $q = $filters['q'];

            $votacoes->where(function ($query) use ($q) {
                $query->where(DB::raw('LOWER(assembleia_id)'), 'LIKE', '%' . strtolower($q) . '%')
                    ->orWhere('cooperado_id', 'LIKE', "%{$q}%")
                    ->orWhere('voto', 'LIKE', "%{$q}%")
                    ->orWhere('data_voto', 'LIKE', "%{$q}%")
                    ->orWhere('justificativa', 'LIKE', "%{$q}%");
            });
        }

        $votacoes = $votacoes
            ->orderBy('data_voto', 'asc')
            ->paginate($perPage);

        return response()->json($votacoes, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate(Votacao::rules(), Votacao::messages());
            $votacao = Votacao::create($validated);

            return response()->json($votacao, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erro ao criar votação',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $votacao = Votacao::find($id);

        if (!$votacao) {
            return response()->json(['message' => 'Votação não encontrada'], 404);
        }

        return response()->json($votacao, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $votacao = Votacao::find($id);

            if (!$votacao) {
                return response()->json(['message' => 'Votação não encontrada'], 404);
            }

            $validated = $request->validate(Votacao::rules($id), Votacao::messages());
            $votacao->update($validated);

            return response()->json($votacao);
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
        $votacao = Votacao::find($id);

        if (!$votacao) {
            return response()->json(['message' => 'Votação não encontrada'], 404);
        }

        return response()->json(null, 204);
    }
}
