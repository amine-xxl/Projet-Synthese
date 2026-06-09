<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifier que le user est connecté ET qu'il est admin
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Accès réservé aux admins'], 403);
        }
        return $next($request);
    }
}
