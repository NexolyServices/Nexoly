<?php

namespace App\Models;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject; // <--- 1. IMPORTAR ESTO

class User extends Authenticatable implements JWTSubject // <--- 2. AGREGAR EL "implements"
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'is_suspended',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- 3. AGREGAR ESTOS DOS MÉTODOS OBLIGATORIOS PARA JWT ---

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
    // Relación: Un usuario puede tener muchos servicios
public function services()
{
    return $this->hasMany(Service::class);
}

    public function reviews()
    {
        return $this->hasMany(\App\Models\Review::class);
    }

    public function sentMessages()
    {
        return $this->hasMany(\App\Models\Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(\App\Models\Message::class, 'receiver_id');
    }
}