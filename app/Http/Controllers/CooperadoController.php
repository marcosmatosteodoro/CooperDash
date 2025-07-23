<?php

namespace App\Http\Controllers;

use App\Models\Cooperado;
use Illuminate\Http\Request;

class CooperadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cooperados = Cooperado::all();
        return response()->json($cooperados, 200);
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

    /**
     * Search cooperados by multiple fields
     */
    public function search(Request $request)
    {
        try {
            $validated = $request->validate([
                'q' => 'required|string|min:2'
            ]);

            $cooperados = Cooperado::where('nome', 'LIKE', "%{$validated['q']}%")
                ->orWhere('documento', 'LIKE', "%{$validated['q']}%")
                ->orWhere('telefone', 'LIKE', "%{$validated['q']}%")
                ->orWhere('email', 'LIKE', "%{$validated['q']}%")
                ->orderBy('nome', 'asc')
                ->get();

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
}
