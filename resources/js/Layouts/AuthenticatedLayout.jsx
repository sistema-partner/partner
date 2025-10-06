import { usePage } from '@inertiajs/react';
import AppHeader from '@/Components/AppHeader';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
            <AppHeader user={user} variant="auth" />

            {/* Header personalizado se necessário */}
            {header && (
                <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Conteúdo principal */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer opcional */}
            <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm mt-auto">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Partner - Plataforma Educacional Inteligente • UFAL {new Date().getFullYear()}
                    </div>
                </div>
            </footer>
        </div>
    );
}