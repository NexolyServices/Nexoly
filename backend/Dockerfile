FROM php:8.2-fpm

# 1. Instalar dependencias del sistema y el driver de PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql

# 2. Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

# 3. Instalar dependencias de Laravel
RUN composer install --no-dev --optimize-autoloader

# 4. Dar permisos a la carpeta de almacenamiento (Importante para Laravel en Docker)
RUN chmod -R 775 storage bootstrap/cache && chown -R www-data:www-data /var/www

# 5. Ejecutar migraciones y encender
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000