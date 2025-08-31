<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Assembleia;
use Illuminate\Support\Facades\DB;

class AssembleiaController extends Controller
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

        $assembleias = Assembleia::query();

        if (!empty($filters['q'])) {
            $q = $filters['q'];

            $assembleias->where(function ($query) use ($q) {
                $query->where(DB::raw('LOWER(titulo)'), 'LIKE', '%' . strtolower($q) . '%')
                    ->orWhere(DB::raw('LOWER(descricao)'), 'LIKE', '%' . strtolower($q) . '%')
                    ->orWhere(DB::raw('LOWER(local)'), 'LIKE', '%' . strtolower($q) . '%');
            });
        }

        $assembleias = $assembleias
            ->orderBy('titulo', 'asc')
            ->paginate($perPage);

        return response()->json($assembleias, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate(Assembleia::rules(), Assembleia::messages());
            $assembleia = Assembleia::create($validated);

            return response()->json($assembleia, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erro ao criar assembleia',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $assembleia = Assembleia::find($id);

        if (!$assembleia) {
            return response()->json(['message' => 'Assembleia não encontrada'], 404);
        }

        return response()->json($assembleia, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $assembleia = Assembleia::find($id);

            if (!$assembleia) {
                return response()->json(['message' => 'Assembleia não encontrada'], 404);
            }

            $validated = $request->validate(Assembleia::rules($id), Assembleia::messages());
            $assembleia->update($validated);

            return response()->json($assembleia);
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
        $assembleia = Assembleia::find($id);

        if (!$assembleia) {
            return response()->json(['message' => 'Assembleia não encontrada'], 404);
        }

        $assembleia->delete();

        return response()->json(null, 204);
    }
}
