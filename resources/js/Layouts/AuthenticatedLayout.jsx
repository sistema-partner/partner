import { usePage } from "@inertiajs/react";
import AppHeader from "@/Components/AppHeader";
import AppFooter from "@/Components/AppFooter";
import ToastProvider from "@/Components/ToastProvider";

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-dark-background dark:via-dark-card dark:to-blue-darker">
            <AppHeader user={user} variant="auth" />

            {/* Header personalizado se necessário */}
            {header && (
                <header className="bg-light-card/90 dark:bg-dark-card/90 backdrop-blur-sm shadow-sm border-b border-light-border/50 dark:border-dark-border">
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Conteúdo principal */}
            <main className="flex-1">{children}</main>

            <AppFooter />
            <ToastProvider />
        </div>
    );
}