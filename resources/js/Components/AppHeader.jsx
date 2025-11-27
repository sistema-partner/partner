import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import Button from "@/Components/Button";
import ThemeToggler from "@/Components/ThemeToggler";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import NotificationItem from "@/Components/Micro/NotificationItem";
import {
    Users,
    Eye,
    GraduationCap,
    BookOpen,
    BarChart3,
    Bell,
    CheckCircle,
} from "lucide-react";

/**
 * AppHeader
 * Props:
 *  - user: usuário autenticado ou null
 *  - variant: 'public' | 'auth'
 *  - showRoleSwitcher: bool (default true)
 *  - initialNotifications: array de notificações (opcional)
 *  - initialUnreadCount: número de não lidas (opcional)
 */
export default function AppHeader({
    user,
    variant = "public",
    showRoleSwitcher = true,
    initialNotifications = [],
    initialUnreadCount = 0,
}) {
    const [openMobile, setOpenMobile] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Buscar notificações via Inertia
    const fetchNotifications = async () => {
        if (!user) return;

        try {
            const response = await fetch("/notifications", {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setNotifications(data.notifications);
                setUnreadCount(data.unread_count);
            }
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
        }
    };

    // Polling para novas notificações
    useEffect(() => {
        if (!user) return;

        fetchNotifications();

        const interval = setInterval(fetchNotifications, 30000); // 30 segundos
        return () => clearInterval(interval);
    }, [user]);

    // Marcar uma notificação individual como lida (sem navegar via Inertia)
    const markAsRead = (notificationId) => {
        if (!notificationId) return;
        // Otimista: atualiza antes da resposta
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === notificationId ? { ...n, read: true } : n
            )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        router.patch(
            `/notifications/${notificationId}/read`,
            {},
            {
                preserveScroll: true,
                onError: (e) => {
                    console.error("Falha ao marcar como lida", e);
                },
            }
        );
    };

    // Marcar todas como lidas
    const markAllAsRead = () => {
        if (unreadCount === 0 || isLoading) return;
        setIsLoading(true);
        router.post(
            "/notifications/mark-all-read",
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNotifications((prev) =>
                        prev.map((notif) => ({ ...notif, read: true }))
                    );
                    setUnreadCount(0);
                },
                onFinish: () => setIsLoading(false),
                onError: () => {
                    console.error("Erro ao marcar todas como lidas");
                    setIsLoading(false);
                },
            }
        );
    };

    // NotificationItem movido para micro componente (importado)

    const getRoleLabel = (role) => {
        const labels = {
            student: "Estudante",
            teacher: "Professor",
            researcher: "Pesquisador",
            admin: "Administrador",
        };
        return labels[role] || role;
    };

    const isAuth = variant === "auth" && !!user;

    return (
        <header className="relative z-30 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            Partner
                        </span>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuth ? (
                            <>
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                                >
                                    Dashboard
                                </NavLink>

                                {/* 🔔 COMPONENTE DE NOTIFICAÇÕES */}
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setIsNotificationsOpen(
                                                !isNotificationsOpen
                                            )
                                        }
                                        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <Bell className="h-5 w-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium">
                                                {unreadCount > 9
                                                    ? "9+"
                                                    : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Dropdown de Notificações */}
                                    {isNotificationsOpen && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-hidden">
                                            {/* Header */}
                                            <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-600">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    Notificações
                                                </h3>
                                                {unreadCount > 0 && (
                                                    <button
                                                        onClick={markAllAsRead}
                                                        disabled={isLoading}
                                                        className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="h-3 w-3" />
                                                        {isLoading
                                                            ? "Processando..."
                                                            : "Marcar todas"}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Lista de Notificações */}
                                            <div className="overflow-y-auto max-h-80">
                                                {notifications.length > 0 ? (
                                                    notifications.map(
                                                        (notification) => (
                                                            <NotificationItem
                                                                key={
                                                                    notification.id
                                                                }
                                                                notification={
                                                                    notification
                                                                }
                                                                onRead={
                                                                    markAsRead
                                                                }
                                                                onClose={() =>
                                                                    setIsNotificationsOpen(
                                                                        false
                                                                    )
                                                                }
                                                            />
                                                        )
                                                    )
                                                ) : (
                                                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                        <p>
                                                            Nenhuma notificação
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer */}
                                            {notifications.length > 0 && (
                                                <div className="p-2 border-t border-gray-200 dark:border-gray-600">
                                                    <Link
                                                        href="/notifications"
                                                        className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-1"
                                                        onClick={() =>
                                                            setIsNotificationsOpen(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        Ver todas as
                                                        notificações
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {showRoleSwitcher && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                                        {user.is_viewing_as_student ? (
                                            <>
                                                <Eye className="h-4 w-4" />
                                                <span>Visão: Estudante</span>
                                            </>
                                        ) : (
                                            <>
                                                {user.role === "teacher" && (
                                                    <BookOpen className="h-4 w-4" />
                                                )}
                                                {user.role === "student" && (
                                                    <GraduationCap className="h-4 w-4" />
                                                )}
                                                {user.role === "researcher" && (
                                                    <BarChart3 className="h-4 w-4" />
                                                )}
                                                <span>
                                                    Visão:{" "}
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                )}
                                <ThemeToggler />

                                {/* Dropdown do usuário */}
                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                                >
                                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                    {user.name}
                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-600">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </div>
                                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                    {getRoleLabel(user.role)}
                                                </div>
                                            </div>
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                                className="flex items-center gap-2"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                Meu Perfil
                                            </Dropdown.Link>
                                            {user.can_view_as_student &&
                                                !user.is_viewing_as_student && (
                                                    <Dropdown.Link
                                                        href={route(
                                                            "view-as-student"
                                                        )}
                                                        method="post"
                                                        as="button"
                                                        className="flex items-center gap-2 text-orange-600 dark:text-orange-400"
                                                    >
                                                        <Eye className="w-4 h-4" />{" "}
                                                        Ver como Aluno
                                                    </Dropdown.Link>
                                                )}
                                            {user.is_viewing_as_student && (
                                                <Dropdown.Link
                                                    href={route("view-normal")}
                                                    method="post"
                                                    as="button"
                                                    className="flex items-center gap-2 text-green-600 dark:text-green-400"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                    Voltar à Minha Visão
                                                </Dropdown.Link>
                                            )}
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="flex items-center gap-2 text-red-600 dark:text-red-400"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                    />
                                                </svg>
                                                Sair
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </>
                        ) : // ... resto do código público permanece igual
                        user ? (
                            <Link
                                href={route("dashboard")}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Button
                                    href={route("login")}
                                    variant="secondary"
                                >
                                    Entrar
                                </Button>
                                <Button
                                    href={route("register")}
                                    variant="primary"
                                >
                                    Registrar
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile buttons */}
                    <div className="flex items-center gap-2 md:hidden">
                        {isAuth && (
                            <>
                                {/* Sininho mobile */}
                                <button
                                    onClick={() =>
                                        setIsNotificationsOpen(
                                            !isNotificationsOpen
                                        )
                                    }
                                    className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center font-medium">
                                            {unreadCount > 9
                                                ? "9+"
                                                : unreadCount}
                                        </span>
                                    )}
                                </button>
                                <ThemeToggler />
                            </>
                        )}
                        <button
                            onClick={() => setOpenMobile(!openMobile)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    className={
                                        !openMobile ? "inline-flex" : "hidden"
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={
                                        openMobile ? "inline-flex" : "hidden"
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile expanded */}
            <div
                className={`${
                    openMobile ? "block" : "hidden"
                } md:hidden border-t border-gray-200 dark:border-gray-700`}
            >
                {isAuth ? (
                    <div className="px-4 py-3 space-y-3">
                        <div className="pb-3 border-b border-gray-200 dark:border-gray-600">
                            <div className="text-base font-medium text-gray-900 dark:text-white">
                                {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                {getRoleLabel(user.role)} • Visão:{" "}
                                {getRoleLabel(user.effective_role)}
                            </div>
                        </div>
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        {user.can_view_as_student &&
                            !user.is_viewing_as_student && (
                                <ResponsiveNavLink
                                    href={route("view-as-student")}
                                    method="post"
                                    as="button"
                                    className="text-orange-600 dark:text-orange-400"
                                >
                                    <Eye className="w-4 h-4 inline mr-2" /> Ver
                                    como Aluno
                                </ResponsiveNavLink>
                            )}
                        {user.is_viewing_as_student && (
                            <ResponsiveNavLink
                                href={route("view-normal")}
                                method="post"
                                as="button"
                                className="text-green-600 dark:text-green-400"
                            >
                                Voltar à Minha Visão
                            </ResponsiveNavLink>
                        )}
                        <ResponsiveNavLink href={route("profile.edit")}>
                            Meu Perfil
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            method="post"
                            href={route("logout")}
                            as="button"
                            className="text-red-600 dark:text-red-400"
                        >
                            Sair
                        </ResponsiveNavLink>
                    </div>
                ) : (
                    <div className="px-4 py-3 space-y-3">
                        <Link
                            href={route("login")}
                            className="block w-full text-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50"
                        >
                            Entrar
                        </Link>
                        <Link
                            href={route("register")}
                            className="block w-full text-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                        >
                            Registrar
                        </Link>
                    </div>
                )}
            </div>

            {/* Overlay para fechar notificações ao clicar fora */}
            {isNotificationsOpen && (
                <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsNotificationsOpen(false)}
                />
            )}
        </header>
    );
}
