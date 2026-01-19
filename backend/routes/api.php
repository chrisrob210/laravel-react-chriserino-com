<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TechnologyController;

Route::post('/auth/clerk-login', [AuthController::class, 'clerkLogin']);

// Public endpoints (no auth required)
Route::get('/projects/portfolio', [ProjectController::class, 'portfolio']);
Route::get('/technologies', [TechnologyController::class, 'index']);
Route::get('/technologies/by-category', [TechnologyController::class, 'byCategory']);

// Project routes with authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
});
