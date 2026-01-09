<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return view('welcome');
});

// ESTA ES LA ÚNICA QUE NECESITAS AHORA
Route::get('/conectar-fotos', function () {
    try {
        // Esto NO borra la base de datos, solo conecta la carpeta de imágenes
        Artisan::call('storage:link');
        return "✅ Enlace de fotos creado. Ahora intenta resubir tus fotos.";
    } catch (\Exception $e) {
        return "❌ Error: " . $e->getMessage();
    }
});