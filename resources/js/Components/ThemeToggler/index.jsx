import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

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
            onClick={toggleTheme}
            className={`p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
        >
            {isDark ? 'Claro' : 'Escuro'}
        </button>
    );
}