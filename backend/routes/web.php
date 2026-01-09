<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('welcome');
});

/**
 * ⚠️ RUTA DE EMERGENCIA: RESET DE BASE DE DATOS
 * Esta ruta borrará todas las tablas y las volverá a crear con la nueva estructura
 * (city, role_id, google_id, etc.) que definimos en la migración.
 */
Route::get('/limpieza-profunda-db-nexoly-2026', function () {
    try {
        // Ejecuta el comando migrate:fresh. 
        // El parámetro --force es OBLIGATORIO en producción (Render).
        Artisan::call('migrate:fresh', ['--force' => true]);
        
        return response()->json([
            'status' => 'success',
            'message' => '✅ Base de datos reseteada correctamente. Las nuevas columnas ya están disponibles.',
            'output' => Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => '❌ Error al resetear la base de datos',
            'error' => $e->getMessage()
        ], 500);
    }
});