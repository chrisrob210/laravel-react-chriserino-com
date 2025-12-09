<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Test route (no authentication required)
Route::get('/test', function () {
    return response()->json([
        'message' => 'Laravel API is working!',
        'timestamp' => now(),
    ]);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
