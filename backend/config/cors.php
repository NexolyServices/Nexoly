<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Agrega tus dominios EXACTOS (sin la barra / al final)
    'allowed_origins' => [
        'https://nexoly.vercel.app',
        'http://localhost:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // ESTO ES LO QUE ESTÁ CAUSANDO EL BLOQUEO SI NO ESTÁ BIEN CONFIGURADO ARRIBA
    'supports_credentials' => true,
];