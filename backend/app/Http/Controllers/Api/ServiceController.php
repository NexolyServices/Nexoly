<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Contract; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ServiceController extends Controller
{
    /**
     * Listar servicios con filtros
     */
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

    /**
     * Crear un nuevo servicio con imagen
     */
    public function store(Request $request)
{
    try {
        // 1. Log inicial para saber qué está llegando al servidor
        \Log::info('Datos recibidos en store:', $request->all());

        // 2. Validación
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|min:0',
            'category'    => 'required|string',
            'modality'    => 'required|in:online,onsite',
            'image'       => 'required|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        if (!$request->hasFile('image')) {
            return response()->json(['message' => 'No se detectó el archivo de imagen'], 422);
        }

        // 3. Cloudinary
        $uploadedFile = $request->file('image');
        $upload = cloudinary()->upload($uploadedFile->getRealPath(), ['folder' => 'services']);
        $imageUrl = $upload->getSecurePath();

        // 4. Creación
        // Usamos auth()->id() que es más seguro para obtener el ID del usuario
        $service = Service::create([
            'user_id'     => auth()->id() ?? $request->user()->id,
            'title'       => $validated['title'],
            'description' => $validated['description'],
            'price'       => $validated['price'],
            'category'    => $validated['category'],
            'modality'    => $validated['modality'],
            'image'       => $imageUrl,
        ]);

        return response()->json($service, 201);

    } catch (\Illuminate\Validation\ValidationException $e) {
        // Si la validación falla, esto te dirá qué campo falta
        return response()->json([
            'message' => 'Error de validación',
            'errors' => $e->errors()
        ], 422);

    } catch (\Throwable $e) {
        // 🚨 ESTO MANDARÁ TODO EL DETALLE A TU CONSOLA (Network -> Response)
        return response()->json([
            'message' => 'Error crítico al crear el servicio',
            'error'   => $e->getMessage(),
            'file'    => $e->getFile(),
            'line'    => $e->getLine(),
            'trace'   => explode("\n", $e->getTraceAsString())[0] // Solo la primera línea del rastro para no saturar
        ], 500);
    }
}

    /**
     * Actualizar servicio existente
     */
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
            $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath(), [
                'folder' => 'services'
            ])->getSecurePath();
            
            // CORRECCIÓN: Usamos 'image' para que coincida con la DB y el método store
            $validated['image'] = $uploadedFileUrl;
        }

        $service->update($validated);

        return response()->json([
            'message' => 'Servicio actualizado con éxito',
            'service' => $service->load('user')
        ]);
    }

    /**
     * Mostrar detalle de un servicio
     */
    public function show($id)
    {
        $service = Service::with(['user', 'reviews.user'])->withAvg('reviews', 'rating')->find($id);

        if (!$service) {
            return response()->json(['message' => 'Servicio no encontrado'], 404);
        }

        return response()->json(['data' => $service]);
    }

    /**
     * Eliminar servicio
     */
    public function destroy(Request $request, $id)
    {
        $service = Service::find($id);
        if (!$service) return response()->json(['message' => 'Servicio no encontrado'], 404);
        if ($service->user_id !== $request->user()->id) return response()->json(['message' => 'No autorizado'], 403);

        $service->delete();
        return response()->json(['message' => 'Servicio eliminado con éxito']);
    }

    /**
     * Servicios del usuario autenticado (Proveedor)
     */
    public function userServices(Request $request)
    {
        return response()->json([
            'data' => $request->user()->services()->latest()->get()
        ]);
    }

    /**
     * Contratar un servicio
     */
    public function createContract(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        if ($service->user_id === $request->user()->id) {
            return response()->json(['message' => 'No puedes contratar tu propio servicio'], 400);
        }

        $contract = Contract::create([
            'user_id' => $request->user()->id,
            'service_id' => $service->id,
            'price' => $service->price,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Servicio contratado con éxito',
            'contract' => $contract
        ], 201);
    }

    /**
     * Contratos realizados por el usuario (Cliente)
     */
    public function userContracts(Request $request)
    {
        $contracts = Contract::where('user_id', $request->user()->id)
            ->with(['service.user'])
            ->latest()
            ->get();

        return response()->json(['data' => $contracts]);
    }

    /**
     * Ventas del usuario (Proveedor)
     */
    public function userSales(Request $request)
    {
        $sales = Contract::whereHas('service', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
        ->with(['service', 'user'])
        ->latest()
        ->get();

        return response()->json(['data' => $sales]);
    }

    /**
     * Listar categorías únicas
     */
    public function categories()
    {
        $categories = Service::distinct()->whereNotNull('category')->pluck('category');
        return response()->json($categories);
    }
}