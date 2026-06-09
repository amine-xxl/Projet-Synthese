<?php

use App\Http\Controllers\ActualiteController;
use App\Http\Controllers\AlerteController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LigneController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProInfoController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// ── Routes publiques ──
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/contact',  [MessageController::class, 'store']);

// ── Lecture publique ──
Route::get('/lignes',     [LigneController::class,     'index']);
Route::get('/actualites', [ActualiteController::class, 'index']);
Route::get('/alertes',    [AlerteController::class,    'index']);

// ── Routes protégées (utilisateur connecté) ──
Route::middleware('auth:sanctum')->group(function () {

    // Déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);

    // Billets
    Route::post('/billets', [TicketController::class, 'store']);
    Route::get('/billets',  [TicketController::class, 'index']);

    // Infos pro chauffeur
    Route::get('/pro-info', [ProInfoController::class, 'getDriverInfo']);

    // Profil utilisateur
    Route::put('/user/update',   [UserController::class, 'update']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);
});

// ── Routes admin ──
Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    // Lignes
    Route::apiResource('admin/lignes', LigneController::class)->except(['index']);

    // Actualités
    Route::get('admin/actualites',              [ActualiteController::class, 'index']);
    Route::post('admin/actualites',             [ActualiteController::class, 'store']);
    Route::get('admin/actualites/{actualite}',  [ActualiteController::class, 'show']);
    Route::post('admin/actualites/{actualite}', [ActualiteController::class, 'update']); // <-- POST au lieu de PUT car on envoie du FormData car FrontEnd ne supporte pas PUT nativement (voir AjoutNews.jsx)
    Route::delete('admin/actualites/{actualite}', [ActualiteController::class, 'destroy']);

    // Alertes
    Route::apiResource('admin/alertes', AlerteController::class)->except(['index']);

    // Messages
    Route::get('admin/messages',              [MessageController::class, 'index']);
    Route::delete('admin/messages/{message}', [MessageController::class, 'destroy']);

    // Chauffeurs / Affectations
    Route::get('admin/chauffeurs',  [ProInfoController::class, 'index']);
    Route::post('admin/chauffeurs', [ProInfoController::class, 'store']);
    Route::put('admin/chauffeurs/{proInfo}',    [ProInfoController::class, 'update']);
    Route::delete('admin/chauffeurs/{proInfo}', [ProInfoController::class, 'destroy']);
});
