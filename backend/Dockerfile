FROM php:8.2-fpm

# Instalar Nginx y dependencias
RUN apt-get update && apt-get install -y \
    nginx \
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

# Configuración de Nginx
COPY nginx.conf /etc/nginx/sites-available/default

RUN composer update google/apiclient --no-dev --optimize-autoloader --no-interaction
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

EXPOSE 10000

# Arrancamos PHP-FPM y Nginx juntos
CMD php artisan cache:clear && \
    php artisan config:cache && \
    php artisan migrate --force && \
    service nginx start && php-fpm