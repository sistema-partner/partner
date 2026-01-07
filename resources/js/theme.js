const THEME_KEY = 'theme';

export function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
}

export function setTheme(theme) {
    const root = document.documentElement;

    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }

    localStorage.setItem(THEME_KEY, theme);
}

export function toggleTheme() {
    const current = getTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
}
