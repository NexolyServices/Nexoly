FROM php:8.2-fpm

# Instalar extensiones y dependencias del sistema para PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_pgsql

# Instalar Composer de forma oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecer el directorio de trabajo
WORKDIR /var/www
COPY . .

# Instalar dependencias de PHP (Laravel)
RUN composer install --no-dev --optimize-autoloader

# Comando Maestro: 
# 1. Ejecuta las migraciones (crea las tablas) automáticamente.
# 2. Inicia el servidor de Laravel.
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000