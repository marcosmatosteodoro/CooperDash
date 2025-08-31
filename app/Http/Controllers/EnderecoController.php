<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Endereco;
use Illuminate\Support\Facades\DB;

class EnderecoController extends Controller
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

        $enderecos = Endereco::query();

        if (!empty($filters['q'])) {
            $q = $filters['q'];

            $enderecos->where(function ($query) use ($q) {
                $query->where(DB::raw('LOWER(logradouro)'), 'LIKE', '%' . strtolower($q) . '%')
                    ->orWhere('cep', 'LIKE', "%{$q}%")
                    ->orWhere('bairro', 'LIKE', "%{$q}%")
                    ->orWhere('cidade', 'LIKE', "%{$q}%")
                    ->orWhere('estado', 'LIKE', "%{$q}%");
            });
        }

        $enderecos = $enderecos
            ->orderBy('logradouro', 'asc')
            ->paginate($perPage);

        return response()->json($enderecos, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate(Endereco::rules(), Endereco::messages());
            $endereco = Endereco::create($validated);

            return response()->json($endereco, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erro ao criar endereço', 
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $endereco = Endereco::find($id);

        if (!$endereco) {
            return response()->json(['message' => 'Endereço não encontrado'], 404);
        }

        return response()->json($endereco, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $endereco = Endereco::find($id);

            if (!$endereco) {
                return response()->json(['message' => 'Endereço não encontrado'], 404);
            }

            $validated = $request->validate(Endereco::rules($id), Endereco::messages());
            $endereco->update($validated);

            return response()->json($endereco);
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
        $endereco = Endereco::find($id);

        if (!$endereco) {
            return response()->json(['message' => 'Endereço não encontrado'], 404);
        }

        $endereco->delete();

        return response()->json(null, 204);
    }
}
