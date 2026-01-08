<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    // Pon tus URLs reales AQUÍ. Si falta una, el navegador bloquea el Login.
    'allowed_origins' => [
        'https://nexoly.vercel.app',
        'http://localhost:5173'
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // Déjalo en true para que el Login funcione bien con JWT/Sanctum
];