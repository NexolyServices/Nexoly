<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // Registro
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role_id' => 'required|integer'
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role_id' => $data['role_id'],
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    // Login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        // Buscamos al usuario para enviarlo junto con el token
        $user = auth()->user();

        return response()->json([
            'token' => $token,
            'user'  => $user // <-- ESTO ES LO QUE FALTABA
        ]);
    }

    // NUEVO: Ver perfil del usuario logueado
    public function userProfile()
    {
        return response()->json([
            'message' => 'Perfil del usuario',
            'user' => auth()->user()
        ]);
    }

    // Actualizar perfil del usuario autenticado
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'profile_image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');
            $path = $file->store('profiles', 'public');
            // Guardamos la ruta pública
            $validated['profile_image'] = '/storage/' . $path;
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Perfil actualizado con éxito',
            'user' => $user
        ]);
    }

    // Logout
    public function logout()
    {
        JWTAuth::parseToken()->invalidate();

        return response()->json(['message' => 'Logout realizado correctamente']);
    }
}