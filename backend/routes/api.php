<?php

 
use App\Http\Controllers\ArticleCategoryController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\EmployeeTypeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BureauController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\test;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);



Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('services', ServiceController::class);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/divisions', [DivisionController::class, 'index']);
    Route::post('/divisions', [DivisionController::class, 'store']);
    Route::get('/divisions/{division}', [DivisionController::class, 'show']); // {division} sera l'ID
    Route::put('/divisions/{division}', [DivisionController::class, 'update']);
    Route::delete('/divisions/{division}', [DivisionController::class, 'destroy']);
    Route::apiResource('bureaux', BureauController::class);
    Route::apiResource('employee-types', EmployeeTypeController::class);
    Route::apiResource('article-categories', ArticleCategoryController::class);
    Route::apiResource('articles', ArticleController::class);
    Route::apiResource('fournisseurs', FournisseurController::class);
    Route::put('/user/profile-information', [ProfileController::class, 'updateProfile']);
    Route::put('/user/password', [ProfileController::class, 'changePassword']);
});
