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

# CAMBIO SEGURO: Actualizamos solo la librería de Google para generar un nuevo lock file
# Esto evita el error "Exit code: 4" sin riesgo de romper tus otras dependencias
RUN composer update google/apiclient --no-dev --optimize-autoloader --no-interaction

# Asegurar permisos correctos ANTES de arrancar
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Exponer el puerto que usa Render
EXPOSE 10000

# Comando optimizado
CMD php artisan cache:clear && \
    php artisan config:cache && \
    php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=10000