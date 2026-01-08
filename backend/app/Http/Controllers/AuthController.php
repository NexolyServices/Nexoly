<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Google_Client; 

class AuthController extends Controller
{
    /**
     * Iniciar Sesión con Google (Upsert: Login o Registro automático)
     */
    public function googleLogin(Request $request)
    {
        $token = $request->input('token');
        
        $client = new Google_Client(['client_id' => env('VITE_GOOGLE_CLIENT_ID')]); 
        
        $payload = $client->verifyIdToken($token);
        
        if (!$payload) {
            return response()->json(['message' => 'Token de Google inválido'], 401);
        }

        $email = $payload['email'];
        $name = $payload['name'];
        $google_id = $payload['sub'];
        $picture = $payload['picture'] ?? null;

        $user = User::where('email', $email)->first();

        if (!$user) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make(Str::random(24)), 
                'profile_image' => $picture,
                'role_id' => 1, 
            ]);
            $isNewUser = true;
        } else {
            $isNewUser = false;
        }

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
            'email' => 'required|string|email:rfc,dns|max:255|unique:users',
            'password' => 'required|string|min:6',
        ], [
            'email.email' => 'El formato del correo no es válido o el dominio no existe.',
            'email.unique' => 'Este correo ya está registrado en nuestro sistema.'
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
     * ✨ NUEVO MÉTODO: Completar Perfil tras registro
     * Este método guarda la ubicación y el rol elegido.
     */
    public function completeProfile(Request $request)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['message' => 'Sesión expirada'], 401);
        }

        $request->validate([
            'role_id' => 'required|integer',
            'country' => 'required|string',
            'state'   => 'required|string',
            'city'    => 'required|string',
        ]);

        $user->update([
            'role_id'       => $request->role_id,
            'country'       => $request->country,
            'state'         => $request->state,
            'city'          => $request->city,
            'business_name' => $request->business_name, // Puede ser null
        ]);

        return response()->json([
            'message' => 'Perfil configurado con éxito',
            'user' => $user
        ]);
    }

    /**
     * Actualizar Perfil (General)
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