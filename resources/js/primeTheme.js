// resources/js/utils/primeTheme.js

let themeLink = null;

function getThemeUrl(themeName) {
    return new URL(
        `../../node_modules/primereact/resources/themes/${themeName}/theme.css`,
        import.meta.url
    ).href;
}

export function loadPrimeTheme(isDark) {
    const themeName = isDark
        ? 'lara-dark-blue'
        : 'lara-light-blue';

    const themeUrl = getThemeUrl(themeName);

    if (!themeLink) {
        themeLink = document.createElement('link');
        themeLink.rel = 'stylesheet';
        themeLink.id = 'prime-theme';
        document.head.appendChild(themeLink);
    }

    if (themeLink.href !== themeUrl) {
        themeLink.href = themeUrl;
    }
}
