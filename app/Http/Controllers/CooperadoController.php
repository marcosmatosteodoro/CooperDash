<?php

namespace App\Http\Controllers;

use App\Models\Cooperado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CooperadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->query('per_page', 10);
            $filters = $request->validate([
                'q' => 'string|min:1',
                'tipo_pessoa' => 'in:FISICA,JURIDICA'
            ]);

            $cooperados = Cooperado::query();

            if (!empty($filters['q'])) {
                $q = $filters['q'];

                $cooperados->where(function ($query) use ($q) {
                    $query->where(DB::raw('LOWER(nome)'), 'LIKE', '%' . strtolower($q) . '%')
                        ->orWhere('documento', 'LIKE', "%{$q}%")
                        ->orWhere('telefone', 'LIKE', "%{$q}%")
                        ->orWhere('email', 'LIKE', "%{$q}%");
                });
            }

            if (!empty($filters['tipo_pessoa'])) {
                $cooperados->where('tipo_pessoa', $filters['tipo_pessoa']);
            }

            $cooperados = $cooperados
                ->orderBy('nome', 'asc')
                ->paginate($perPage);

            return response()->json($cooperados, 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao buscar cooperados',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate(Cooperado::rules($request->tipo_pessoa));
            
            $cooperado = Cooperado::create($validated);
            
            return response()->json($cooperado, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $cooperado = Cooperado::find($id);

        if (!$cooperado) {
            return response()->json(['message' => 'Cooperado não encontrado'], 404);
        }

        return response()->json($cooperado, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $cooperado = Cooperado::find($id);

            if (!$cooperado) {
                return response()->json(['message' => 'Cooperado não encontrado'], 404);
            }

            $validated = $request->validate(Cooperado::rules($request->tipo_pessoa, $id));
            
            $cooperado->update($validated);
            
            return response()->json($cooperado);
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
    public function destroy($id)
    {
        $cooperado = Cooperado::find($id);

        if (!$cooperado) {
            return response()->json(['message' => 'Cooperado não encontrado'], 404);
        }

        $cooperado->delete();
        
        return response()->json(null, 204);
    }
}
