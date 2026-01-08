<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Al usar '*' permitimos cualquier dominio (Vercel, Localhost, etc.)
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // IMPORTANTE: Debe ser false para ser compatible con el '*' de arriba
    'supports_credentials' => false,
];