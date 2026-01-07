import { Sun, Moon } from 'lucide-react';
import { toggleTheme, getTheme } from '@/theme';
import { loadPrimeTheme } from '@/primeTheme';
import { useState } from 'react';

export default function ThemeToggler() {
    const [isDark, setIsDark] = useState(getTheme() === 'dark');

    const handleToggle = async () => {
        const next = !isDark;
        setIsDark(next);
        toggleTheme();
        await loadPrimeTheme(next);
    };

    return (
        <button onClick={handleToggle}>
            {isDark ? <Moon /> : <Sun />}
        </button>
    );
}
