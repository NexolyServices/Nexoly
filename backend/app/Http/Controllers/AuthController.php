<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    /**
     * Iniciar Sesión
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // Intenta autenticar usando el guard de JWT (api)
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
        ]);

        $token = auth('api')->login($user);

        return response()->json([
            'access_token' => $token,
            'user' => $user
        ], 201);
    }

    /**
     * Actualizar Perfil (Compatible con tu FormData de Vue)
     */
    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Actualizar datos básicos
        $user->name = $request->input('name', $user->name);
        $user->email = $request->input('email', $user->email);

        // Si subiste una imagen de perfil
        if ($request->hasFile('profile_image')) {
            // Borrar imagen anterior si existe para no llenar el server de basura
            if ($user->profile_image) {
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

    /**
     * Obtener datos del usuario autenticado
     */
    public function me()
    {
        return response()->json(auth('api')->user());
    }

    /**
     * Cerrar Sesión
     */
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }
}