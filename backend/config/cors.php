<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Usamos '*' para que no haya falla con ningún dominio (Vercel o Local)
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // IMPORTANTE: Debe ser false para que el '*' de arriba funcione sin errores
    'supports_credentials' => false,
];