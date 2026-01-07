import "../css/app.css";
import "./bootstrap";

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

import { getTheme, setTheme } from './theme';
import { loadPrimeTheme } from './primeTheme';

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

// aplica tema ANTES do render
const theme = getTheme();
const isDark = theme === 'dark';

setTheme(theme);
await loadPrimeTheme(isDark);

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
