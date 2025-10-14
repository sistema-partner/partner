import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggler({ className = '' }) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return null;
    }

    const isDark = resolvedTheme === 'dark';

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            className={`group relative inline-flex items-center justify-center p-2 rounded-md border border-transparent text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${className}`}
        >
            {/* Ícone Sol (tema claro) */}
            <Sun
                className={`h-5 w-5 transition-all duration-300 ${isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
            />
            {/* Ícone Lua (tema escuro) */}
            <Moon
                className={`h-5 w-5 absolute transition-all duration-300 ${isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`}
            />
            <span className="sr-only">{isDark ? 'Tema claro' : 'Tema escuro'}</span>
        </button>
    );
}