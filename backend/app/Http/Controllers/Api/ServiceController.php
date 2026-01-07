<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Contract; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    public function index()
    {
        try {
            $query = Service::with('user')->withAvg('reviews', 'rating');

            $query->when(request('q'), function ($q, $v) {
                $q->where(function ($s) use ($v) {
                    $s->where('title', 'like', "%{$v}%")
                      ->orWhere('description', 'like', "%{$v}%");
                });
            });

            $query->when(request('category'), function ($q, $v) {
                $q->where('category', $v);
            });

            $query->when(request('modality'), function ($q, $v) {
                $q->where('modality', $v);
            });

            $query->when(request('minPrice'), function ($q, $v) {
                $q->where('price', '>=', (float) $v);
            });

            $query->when(request('maxPrice'), function ($q, $v) {
                $q->where('price', '<=', (float) $v);
            });

            $perPage = (int) request('per_page', 12);
            $services = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json($services);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error en el servidor',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|min:0',
            'category'    => 'required|string',
            'modality'    => 'required|in:online,onsite',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('services', 'public');
            $validated['image_url'] = asset('storage/' . $path);
        }

        $service = $request->user()->services()->create($validated);

        return response()->json([
            'message' => 'Servicio creado con éxito',
            'service' => $service
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['message' => 'Servicio no encontrado'], 404);
        }

        if ($service->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price'       => 'sometimes|numeric|min:0',
            'category'    => 'sometimes|string',
            'modality'    => 'sometimes|in:online,onsite',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        if ($request->hasFile('image')) {
            if ($service->image_url) {
                $oldPath = str_replace(asset('storage/'), '', $service->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image')->store('services', 'public');
            $validated['image_url'] = asset('storage/' . $path);
        }

        $service->update($validated);

        return response()->json([
            'message' => 'Servicio actualizado con éxito',
            'service' => $service
        ]);
    }

    public function show($id)
    {
        $service = Service::with(['user', 'reviews.user'])->withAvg('reviews', 'rating')->find($id);

        if (!$service) {
            return response()->json(['message' => 'Servicio no encontrado'], 404);
        }

        return response()->json(['data' => $service]);
    }

    public function destroy(Request $request, $id)
    {
        $service = Service::find($id);
        if (!$service) return response()->json(['message' => 'Servicio no encontrado'], 404);
        if ($service->user_id !== $request->user()->id) return response()->json(['message' => 'No autorizado'], 403);

        if ($service->image_url) {
            $oldPath = str_replace(asset('storage/'), '', $service->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $service->delete();
        return response()->json(['message' => 'Servicio eliminado con éxito']);
    }

    public function userServices(Request $request)
    {
        return response()->json([
            'data' => $request->user()->services()->latest()->get()
        ]);
    }

    // --- NUEVOS MÉTODOS DE CONTRATACIÓN ---

    public function createContract(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        // No permitir auto-contratación
        if ($service->user_id === $request->user()->id) {
            return response()->json(['message' => 'No puedes contratar tu propio servicio'], 400);
        }

        $contract = Contract::create([
            'user_id' => $request->user()->id, // El cliente
            'service_id' => $service->id,
            'price' => $service->price,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Servicio contratado con éxito',
            'contract' => $contract
        ], 201);
    }

    public function userContracts(Request $request)
    {
        // Compras: Contratos realizados por el usuario logueado
        $contracts = Contract::where('user_id', $request->user()->id)
            ->with(['service.user'])
            ->latest()
            ->get();

        return response()->json(['data' => $contracts]);
    }

    public function userSales(Request $request)
    {
        // Ventas: Contratos donde el dueño del servicio es el usuario logueado
        $sales = Contract::whereHas('service', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
        ->with(['service', 'user']) // 'user' es el cliente que compró
        ->latest()
        ->get();

        return response()->json(['data' => $sales]);
    }

    public function categories()
    {
        $categories = Service::distinct()->whereNotNull('category')->pluck('category');
        return response()->json($categories);
    }
}