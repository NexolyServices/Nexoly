<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $blueprint) {
            // Añadimos los campos necesarios para Nexoly
            $blueprint->string('country')->nullable();
            $blueprint->string('state')->nullable();
            $blueprint->string('city')->nullable();
            $blueprint->string('business_name')->nullable();
            // El role_id ya lo tienes, pero asegurémonos de que sea accesible
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $blueprint) {
            $blueprint->dropColumn(['country', 'state', 'city', 'business_name']);
        });
    }
};
