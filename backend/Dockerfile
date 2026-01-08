FROM php:8.2-fpm

# Instalar dependencias esenciales
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    libzip-dev \
    zip \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

# Actualizar solo la librería necesaria
RUN composer update google/apiclient --no-dev --optimize-autoloader --no-interaction

# Permisos para Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

EXPOSE 10000

# COMANDO FINAL CORREGIDO (Sin Nginx para evitar complicaciones):
# 1. Limpia caché.
# 2. Ejecuta migraciones.
# 3. Inicia el servidor de PHP forzando a que todas las rutas pasen por Laravel.
CMD php artisan cache:clear && \
    php artisan config:cache && \
    php artisan migrate --force && \
    php -S 0.0.0.0:10000 -t public public/index.php