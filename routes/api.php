<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CooperadoController;
use App\Http\Controllers\EnderecoController;
use App\Http\Controllers\ContasCorrenteController;
use App\Http\Controllers\TransacaoController;
use App\Http\Controllers\EmprestimoController;
use App\Http\Controllers\ParcelasEmprestimoController;
use App\Http\Controllers\AssembleiaController;
use App\Http\Controllers\VotacaoController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('cooperados', CooperadoController::class);
Route::apiResource('enderecos', EnderecoController::class);
Route::apiResource('contas-correntes', ContasCorrenteController::class);
Route::apiResource('transacoes', TransacaoController::class);
Route::apiResource('emprestimos', EmprestimoController::class);
Route::apiResource('parcelas-emprestimos', ParcelasEmprestimoController::class);
Route::apiResource('assembleias', AssembleiaController::class);
Route::apiResource('votacoes', VotacaoController::class);
