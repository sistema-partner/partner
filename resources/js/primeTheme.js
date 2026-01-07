let currentTheme = null;

export async function loadPrimeTheme(isDark) {
    const theme = isDark
        ? 'lara-dark-blue'
        : 'lara-light-blue';

    if (currentTheme === theme) return;

    currentTheme = theme;

    if (isDark) {
        await import('primereact/resources/themes/lara-dark-blue/theme.css');
    } else {
        await import('primereact/resources/themes/lara-light-blue/theme.css');
    }
}
