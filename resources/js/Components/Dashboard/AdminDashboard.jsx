import {
    Users,
    AlertTriangle,
    UserPlus,
    BarChart3,
    ShieldCheck,
} from "lucide-react";
import GlassCard from "@/Components/GlassCard";
import { Head, Link } from "@inertiajs/react";

export default function AdminDashboard({
    user,
    pendingApprovalsCount = 0,
    totalUsers = 0,
    recentUsers = [],
    teachers = [],
    role_counts = [],
}) {
    const stats = [
        {
            key: "totalUsers",
            label: "Usuários Totais",
            value: totalUsers,
            icon: Users,
            iconColor: "text-indigo-500",
            iconBg: "bg-indigo-100 dark:bg-indigo-500/20",
            gradient: "from-indigo-500/10 via-indigo-500/5 to-transparent",
            ring: "ring-indigo-500/30",
        },
        {
            key: "pendingApprovals",
            label: "Aprovações Pendentes",
            value: pendingApprovalsCount,
            icon: AlertTriangle,
            iconColor: "text-orange-600",
            iconBg: "bg-orange-100 dark:bg-orange-500/20",
            gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
            ring: "ring-orange-500/30",
        },
        {
            key: "recentUsers",
            label: "Novos Usuários",
            value: recentUsers.length,
            icon: UserPlus,
            iconColor: "text-green-600",
            iconBg: "bg-green-100 dark:bg-green-500/20",
            gradient: "from-green-500/10 via-green-500/5 to-transparent",
            ring: "ring-green-500/30",
        },
    ];

    console.log({ role_counts });

    return (
        <div className="space-y-8">
            <Head title="Admin - Visão Geral" />

            {/* Estatísticas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map(
                    ({
                        key,
                        label,
                        value,
                        icon: Icon,
                        iconColor,
                        iconBg,
                        gradient,
                        ring,
                    }) => (
                        <div key={key} className="relative group">
                            <GlassCard
                                padding="sm"
                                className={`p-5 overflow-hidden bg-gradient-to-br ${gradient} dark:from-white/5 dark:via-white/5 dark:to-transparent ring-1 ${ring} dark:ring-white/10 backdrop-blur-sm transition-shadow group-hover:shadow-md`}
                            >
                                <div className="pointer-events-none absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/30 dark:bg-white/5 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                                <div className="flex items-start justify-between relative">
                                    <div className="flex items-center">
                                        <span
                                            className={`mr-3 inline-flex items-center justify-center h-12 w-12 rounded-xl ${iconBg} ring-1 ring-inset ${
                                                ring.split(" ")[0]
                                            } backdrop-blur-sm`}
                                        >
                                            <Icon
                                                className={`h-6 w-6 ${iconColor}`}
                                            />
                                        </span>
                                        <div>
                                            <h3 className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                                                {label}
                                            </h3>
                                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                                {value}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    )
                )}
            </div>

            {/* Conteúdo em Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distribuição por Papel */}
                <GlassCard padding="sm" className="p-0">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-indigo-500" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Distribuição por Papel
                        </h2>
                        {role_counts.length > 0 && (
                            <span className="ml-auto px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-full">
                                {role_counts.length} tipos
                            </span>
                        )}
                    </div>
                    <div className="p-6">
                        <div className="flex flex-wrap gap-3">
                            {role_counts.map((r) => (
                                <div
                                    key={r.role}
                                    className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 text-sm flex items-center gap-2"
                                >
                                    <span className="font-medium text-gray-700 dark:text-gray-200">
                                        {getRoleLabel(r.role)}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {r.count}
                                    </span>
                                </div>
                            ))}
                            {role_counts.length === 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Sem dados disponíveis.
                                </p>
                            )}
                        </div>
                    </div>
                </GlassCard>

                {/* Usuários Recentes */}
                <GlassCard padding="sm" className="p-0">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-green-600" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Usuários Recentes
                            </h2>
                        </div>
                    </div>
                    <div className="p-6">
                        {recentUsers.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Nenhum usuário recente.
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {recentUsers.map((u) => (
                                    <li
                                        key={u.id}
                                        className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {u.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {u.email}
                                            </p>
                                        </div>
                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                            {getRoleLabel(u.role)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Aprovações Pendentes */}
            <GlassCard padding="sm" className="p-0">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-orange-500" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Aprovações Pendentes
                        </h2>
                        {teachers.length > 0 && (
                            <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300 rounded-full">
                                {teachers.length}
                            </span>
                        )}
                    </div>
                </div>
                <div className="p-6">
                    {teachers.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Nenhuma solicitação de aprovação pendente.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {teachers.map((t) => (
                                <div
                                    key={t.id}
                                    className="flex justify-between items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {t.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {t.email}
                                        </p>
                                        {t.created_at && (
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                Registrado em:{" "}
                                                {new Date(
                                                    t.created_at
                                                ).toLocaleDateString("pt-BR")}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={route("admin.approve", t.id)}
                                            method="patch"
                                            as="button"
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        >
                                            Aprovar
                                        </Link>
                                        <Link
                                            href={route("admin.reject", t.id)}
                                            method="delete"
                                            as="button"
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        >
                                            Rejeitar
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}

function getRoleLabel(role) {
    const labels = {
        student: "Estudante",
        teacher: "Professor",
        researcher: "Pesquisador",
        admin: "Administrador",
    };
    return labels[role] || role;
}
