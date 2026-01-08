<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Google_Client; // Importamos la librería de Google

class AuthController extends Controller
{
    /**
     * Iniciar Sesión con Google (Upsert: Login o Registro automático)
     */
    public function googleLogin(Request $request)
    {
        $token = $request->input('token');
        
        // 1. Configurar el cliente de Google
        $client = new Google_Client(['client_id' => env('VITE_GOOGLE_CLIENT_ID')]); 
        
        // 2. Verificar que el token sea auténtico
        $payload = $client->verifyIdToken($token);
        
        if (!$payload) {
            return response()->json(['message' => 'Token de Google inválido'], 401);
        }

        // 3. Extraer datos del payload de Google
        $email = $payload['email'];
        $name = $payload['name'];
        $google_id = $payload['sub'];
        $picture = $payload['picture'] ?? null;

        // 4. Buscar al usuario o crearlo (Upsert)
        $user = User::where('email', $email)->first();

        if (!$user) {
            // Si el usuario no existe, lo registramos
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make(Str::random(24)), // Password aleatorio por seguridad
                'profile_image' => $picture,
                'role_id' => 1, // Por defecto como Cliente (puedes ajustarlo)
            ]);
            $isNewUser = true;
        } else {
            $isNewUser = false;
        }

        // 5. Generar el token JWT de tu sistema para este usuario
        $token = auth('api')->login($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => $user,
            'is_new_user' => $isNewUser
        ]);
    }

    /**
     * Iniciar Sesión Tradicional
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'message' => 'Acceso denegado: Verifica tus credenciales'
            ], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => auth('api')->user()
        ]);
    }

    /**
     * Registro de Usuario
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id ?? 1,
        ]);

        $token = auth('api')->login($user);

        return response()->json([
            'access_token' => $token,
            'user' => $user
        ], 201);
    }

    /**
     * Actualizar Perfil
     */
    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $user->name = $request->input('name', $user->name);
        $user->email = $request->input('email', $user->email);

        if ($request->hasFile('profile_image')) {
            if ($user->profile_image && !str_contains($user->profile_image, 'googleusercontent.com')) {
                $oldPath = str_replace(asset('storage/'), '', $user->profile_image);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('profile_image')->store('profiles', 'public');
            $user->profile_image = asset('storage/' . $path);
        }

        $user->save();

        return response()->json([
            'message' => 'Perfil actualizado con éxito',
            'user' => $user
        ]);
    }

    public function me()
    {
        return response()->json(auth('api')->user());
    }

    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }
}