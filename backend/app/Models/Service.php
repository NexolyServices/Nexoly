<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'category',
        'modality',
        'image_url',
        'active',
        'user_id'
    ];

    // Esto hace que cada vez que pidas un servicio, se incluya el score de confianza automáticamente
    protected $appends = ['reliability_score'];

    /**
     * Lógica de la Barra de Confiabilidad
     * Calcula un porcentaje basado en el promedio de estrellas y atributos positivos.
     */
    public function getReliabilityScoreAttribute()
    {
        // Usamos relationship loading para evitar errores si no están cargadas
        $reviews = $this->reviews;
        
        if (!$reviews || $reviews->count() === 0) {
            return 100; // Vendedores nuevos empiezan con confianza plena
        }

        $total = $reviews->count();

        // 1. Base por Estrellas (Máximo 70 puntos)
        $avgStars = $reviews->avg('rating');
        $starScore = ($avgStars / 5) * 70;

        // 2. Bonus por Atributos Positivos (Máximo 30 puntos)
        // Analizamos cuántas reseñas tienen el array de atributos con contenido
        $positiveReviews = $reviews->filter(function($review) {
            // Verificamos que sea un array o un objeto decodificable
            $attrs = is_string($review->attributes) ? json_decode($review->attributes, true) : $review->attributes;
            return is_array($attrs) && count($attrs) > 0;
        })->count();
        
        $attributeScore = ($positiveReviews / $total) * 30;

        return (int) round($starScore + $attributeScore);
    }

    /**
     * Relación con el Usuario (Dueño del servicio)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación con las Reseñas
     */
    public function reviews()
    {
        return $this->hasMany(\App\Models\Review::class);
    }

    /**
     * Promedio de Rating
     */
    public function averageRating()
    {
        return $this->reviews()->avg('rating');
    }
}