<?php

namespace App\Http\Controllers;

use App\Models\Alerte;
use Illuminate\Http\Request;

/**
 * Contrôleur AlerteController
 *
 * Gère les alertes en temps réel concernant les lignes de bus.
 */
class AlerteController extends Controller
{
    public function index()
    {
        return response()->json(Alerte::with('ligne')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'ligne_id' => 'required|exists:lignes,id',
            'type'     => 'required|in:retard,perturbation,info',
            'message'  => 'required|string',
            'statut'   => 'required|in:active,resolue',
        ]);

        $alerte = Alerte::create($request->only(['ligne_id', 'type', 'message', 'statut']));

        return response()->json($alerte->load('ligne'), 201);
    }

    public function show(Alerte $alerte)
    {
        return response()->json($alerte->load('ligne'));
    }

    public function update(Request $request, Alerte $alerte)
    {
        $request->validate([
            'ligne_id' => 'sometimes|exists:lignes,id',
            'type'     => 'sometimes|in:retard,perturbation,info',
            'message'  => 'sometimes|string',
            'statut'   => 'sometimes|in:active,resolue',
        ]);

        $alerte->update($request->only(['ligne_id', 'type', 'message', 'statut']));

        return response()->json($alerte->load('ligne'));
    }

    public function destroy(Alerte $alerte)
    {
        $alerte->delete();
        return response()->json(['message' => 'Alerte supprimée']);
    }
}
