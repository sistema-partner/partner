<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Verified;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Ao verificar o email do usuário, aprova automaticamente professores/pesquisadores.
        // Isso resolve o caso onde o professor confirma o e-mail, mas continua com
        // status 'pending' e, por isso, recebe 403 ao tentar criar cursos.
        Event::listen(Verified::class, function (Verified $event) {
            $user = $event->user;

            if (in_array($user->role, ['teacher', 'researcher']) && $user->status !== 'approved') {
                $user->status = 'approved';
                $user->save();
            }
        });
    }
}
