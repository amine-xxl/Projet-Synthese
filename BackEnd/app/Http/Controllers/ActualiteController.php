<?php

namespace App\Http\Controllers;

use App\Models\Actualite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Contrôleur ActualiteController
 *
 * Gère les opérations CRUD pour les actualités.
 */
class ActualiteController extends Controller
{
    public function index()
    {
        return response()->json(Actualite::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre'   => 'required|string|max:255',
            'contenu' => 'required|string',
            'image'   => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['titre', 'contenu']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('actualites', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $actualite = Actualite::create($data);
        return response()->json($actualite, 201);
    }

    public function show(Actualite $actualite)
    {
        return response()->json($actualite);
    }

    public function update(Request $request, Actualite $actualite)
    {
        $request->validate([
            'titre'   => 'sometimes|string|max:255',
            'contenu' => 'sometimes|string',
            'image'   => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['titre', 'contenu']);

        if ($request->hasFile('image')) {
            // Supprime l'ancienne image
            if ($actualite->image) {
                $oldPath = str_replace('/storage/', '', $actualite->image); // str_replace pour obtenir le chemin relatif
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('actualites', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $actualite->update($data);
        return response()->json($actualite);
    }

    public function destroy(Actualite $actualite)
    {
        if ($actualite->image) {
            $oldPath = str_replace('/storage/', '', $actualite->image);
            Storage::disk('public')->delete($oldPath);
        }

        $actualite->delete();
        return response()->json(['message' => 'Actualité supprimée']);
    }
}
