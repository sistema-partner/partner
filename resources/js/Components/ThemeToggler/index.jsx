import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { loadPrimeTheme } from '@/primeTheme';

export default function ThemeToggler({ className = '' }) {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Inicializa tema
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldUseDark = savedTheme
            ? savedTheme === 'dark'
            : prefersDark;

        document.documentElement.classList.toggle('dark', shouldUseDark);
        setIsDark(shouldUseDark);

        loadPrimeTheme(shouldUseDark);
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const nextIsDark = !isDark;

        document.documentElement.classList.toggle('dark', nextIsDark);
        localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');

        setIsDark(nextIsDark);
        loadPrimeTheme(nextIsDark);
    };

    if (!mounted) return null;

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            className={`
                relative inline-flex items-center justify-center
                p-2 rounded-md border
                border-light-border dark:border-dark-border
                text-light-muted-foreground dark:text-dark-muted-foreground
                hover:text-blue-primary dark:hover:text-blue-light
                hover:bg-light-muted dark:hover:bg-dark-muted
                transition-colors focus:outline-none
                focus:ring-2 focus:ring-blue-primary focus:ring-offset-2
                focus:ring-offset-light-background dark:focus:ring-offset-dark-background
                ${className}
            `}
        >
            {/* Sol */}
            <Sun
                className={`
                    h-5 w-5 transition-all duration-300
                    ${isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}
                `}
            />

            {/* Lua */}
            <Moon
                className={`
                    absolute h-5 w-5 transition-all duration-300
                    ${isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}
                `}
            />

            <span className="sr-only">
                {isDark ? 'Tema claro' : 'Tema escuro'}
            </span>
        </button>
    );
}
