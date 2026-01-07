# Nexoly — Marketplace de Servicios (MVP)

Proyecto: **Nexoly** — marketplace de servicios (Laravel API + Vue 3 SPA)

Stack por defecto:
- Backend: Laravel (PHP 8.1+)
- Frontend: Vue 3 (Vite) + Tailwind CSS
- DB: MySQL (XAMPP)

Objetivo de este scaffold: proporcionar instrucciones y archivos iniciales (migraciones, modelos y controladores *stubs*) para que puedas crear el proyecto Laravel en `backend/` y el frontend en `frontend/`.

Requisitos locales:
- PHP 8.1+
- Composer
- Node.js + npm/yarn
- MySQL (ej. XAMPP)

Pasos rápidos para levantar el proyecto (backend):

1. Crear el proyecto Laravel:

```powershell
cd c:\xampp\htdocs\Nexoly
composer create-project laravel/laravel backend
```

2. Configurar `.env` en `backend/` (DB, APP_KEY, etc.) y generar key:

```powershell
cd backend
cp .env.example .env
php artisan key:generate
```

3. Instalar paquete JWT (ej. `tymon/jwt-auth`) y publicar configuración:

```powershell
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

4. Copiar las migraciones del directorio `backend/database/migrations_init/` a `backend/database/migrations/` y ejecutar:

```powershell
php artisan migrate
```

5. (Opcional) Seed inicial de roles:

```powershell
php artisan db:seed --class=RoleSeeder
```

Frontend (Vue 3 + Vite):

1. Crear la app frontend en `frontend/`:

```powershell
cd c:\xampp\htdocs\Nexoly
npm create vite@latest frontend -- --template vue
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Ajustar `vite` y `proxy` para que las peticiones API vayan a `http://localhost:8000/api` (o puerto donde corra Laravel)

Notas:
- Pagos: se implementará simulación funcional en el backend para el MVP.
- No se incluye login social en fase inicial.

Documentación de endpoints y pruebas se agregarán en `docs/`.

---

Si quieres, puedo proceder a copiar los archivos de migración inicial y los stubs (models, controladores, rutas) en el directorio `backend/` para que sólo tengas que ejecutar `composer install` y `php artisan migrate`.

Si estás listo, doy el siguiente paso y creo esos archivos en el workspace.
