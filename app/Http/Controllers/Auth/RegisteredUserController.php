<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', Rule::in(['student', 'teacher', 'researcher'])],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => $request->role === 'teacher' || $request->role === 'researcher' ? 'pending' : 'approved',
        ]);

        // 🔥 IMPORTANTE: Disparar o evento Registered para TODOS os usuários
        event(new Registered($user));

        // Se for estudante, faz login automaticamente
        if ($user->role === 'student') {
            Auth::login($user);
            return redirect(route('dashboard'))->with('status', 'Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.');
        }

        // Se for professor/pesquisador, redireciona para login
        return redirect(route('login'))->with('status', 'Cadastro recebido! Aguarde a aprovação de um administrador e verifique seu email para confirmar sua conta.');
    }
}