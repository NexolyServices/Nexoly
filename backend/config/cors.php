<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    // Rutas que aplicarán estas reglas
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Permitimos todos los métodos (GET, POST, PUT, DELETE)
    'allowed_methods' => ['*'],

    // AQUÍ ESTÁ EL CAMBIO CLAVE:
    // No uses '*', especifica tus dominios para que 'supports_credentials' funcione.
    'allowed_origins' => [
        'https://nexoly.vercel.app', 
        'http://localhost:5173',
        'http://localhost:3000'
    ],

    'allowed_origins_patterns' => [],

    // Permitimos todos los encabezados (Authorization, Content-Type, etc.)
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // CAMBIO CLAVE 2: 
    // Debe ser true para permitir el envío de Tokens y Cookies entre dominios.
    'supports_credentials' => true,

];