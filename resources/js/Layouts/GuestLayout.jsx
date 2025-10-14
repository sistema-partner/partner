import { Link } from '@inertiajs/react';
import { Users } from 'lucide-react';
import AppFooter from '@/Components/AppFooter';

export default function GuestLayout({ children }) {
    return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
            {/* Header */}
            <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Partner
                            </span>
                        </Link>
                        
                        <nav className="flex gap-4">
                            <Link
                                href={route('login')}
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                Entrar
                            </Link>
                            <Link
                                href={route('register')}
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                Registrar
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </main>

            <AppFooter variant="compact" />
        </div>
    );
}