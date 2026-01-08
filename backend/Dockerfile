FROM php:8.2-fpm

# Instalar dependencias del sistema y drivers de PostgreSQL
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

# Actualizamos solo la librería de Google para generar un nuevo lock file si es necesario
RUN composer update google/apiclient --no-dev --optimize-autoloader --no-interaction

# Asegurar permisos correctos para que Laravel pueda escribir logs y cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Exponer el puerto que usa Render (10000 por defecto en sus planes)
EXPOSE 10000

# COMANDO CORREGIDO:
# 1. Limpiamos y cacheamos la configuración.
# 2. Corremos migraciones automáticamente.
# 3. Lanzamos el servidor PHP apuntando a 'public' para que funcionen las rutas /api/
CMD php artisan cache:clear && \
    php artisan config:cache && \
    php artisan migrate --force && \
    php -S 0.0.0.0:10000 -t public