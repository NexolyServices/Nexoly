<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan; // <--- ESTA LÍNEA ES VITAL
use Illuminate\Support\Facades\Schema;  // <--- ESTA TAMBIÉN PARA dropAllTables

Route::get('/', function () {
    return view('welcome');
});

Route::get('/limpieza-profunda-db-nexoly-2026', function () {
    try {
        // 1. Limpiamos cualquier caché de tablas
        Schema::dropAllTables();
        
        // 2. Ejecutamos las migraciones desde cero absoluto
        Artisan::call('migrate', ['--force' => true]);
        
        return response()->json([
            'status' => 'success',
            'message' => '✅ Base de datos reconstruida desde cero. Tablas limpias y nuevas columnas listas.'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'error' => $e->getMessage()
        ], 500);
    }
});