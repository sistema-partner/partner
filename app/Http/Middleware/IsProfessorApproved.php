<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsProfessorApproved
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
        {
            if (auth()->check() && auth()->user()->role === 'professor' && auth()->user()->status === 'approved') {
                return $next($request);
            }
            return redirect()->route('login')->withErrors(['email' => 'Sua conta de professor não foi aprovada ou está desativada.']);
        }
}
