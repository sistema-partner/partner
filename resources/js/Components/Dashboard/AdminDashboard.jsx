import { Head, Link } from "@inertiajs/react";

// Props esperadas enviadas pelo Dashboard: user, pendingApprovalsCount, totalUsers, recentUsers, teachers
export default function AdminDashboard({
    user,
    pendingApprovalsCount = 0,
    totalUsers = 0,
    recentUsers = [],
    teachers = [],
    role_counts = [],
}) {
    return (
        <div className="space-y-8">
            <Head title="Admin - Visão Geral" />
            <section className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Resumo</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 border rounded">
                        <p className="text-sm text-gray-500">Usuários Totais</p>
                        <p className="text-2xl font-semibold">{totalUsers}</p>
                    </div>
                    <div className="p-4 border rounded">
                        <p className="text-sm text-gray-500">
                            Aprovações Pendentes
                        </p>
                        <p className="text-2xl font-semibold">
                            {pendingApprovalsCount}
                        </p>
                    </div>
                    <div className="p-4 border rounded">
                        <p className="text-sm text-gray-500">
                            Novos Usuários Recentes
                        </p>
                        <p className="text-2xl font-semibold">
                            {recentUsers.length}
                        </p>
                    </div>
                    <div className="p-4 border rounded col-span-1 sm:col-span-3">
                        <p className="text-sm text-gray-500 mb-2">
                            Distribuição por Papel
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {role_counts.map((r) => (
                                <div
                                    key={r.role}
                                    className="px-3 py-1 bg-gray-100 rounded text-sm flex items-center gap-2"
                                >
                                    <span className="font-medium">
                                        {getRoleLabel(r.role)}
                                    </span>
                                    <span className="text-gray-600">
                                        {r.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">
                    Professores / Pesquisadores Pendentes
                </h2>
                {teachers.length === 0 && (
                    <p className="text-gray-500 text-sm">
                        Nenhuma solicitação pendente.
                    </p>
                )}
                {teachers.map((teacher) => (
                    <div
                        key={teacher.id}
                        className="flex justify-between items-center mb-2 p-2 border rounded"
                    >
                        <div>
                            <div className="font-medium">{teacher.name}</div>
                            <div className="text-xs text-gray-500">
                                {teacher.email}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={route("admin.approve", teacher.id)}
                                method="patch"
                                as="button"
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                            >
                                Aprovar
                            </Link>
                            <Link
                                href={route("admin.reject", teacher.id)}
                                method="delete"
                                as="button"
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                            >
                                Rejeitar
                            </Link>
                        </div>
                    </div>
                ))}
            </section>

            <section className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Usuários Recentes</h2>
                {recentUsers.length === 0 && (
                    <p className="text-gray-500 text-sm">
                        Nenhum usuário recente.
                    </p>
                )}
                <ul className="space-y-2">
                    {recentUsers.map((u) => (
                        <li
                            key={u.id}
                            className="flex justify-between text-sm border rounded p-2"
                        >
                            <span>{u.name}</span>
                            <span className="text-gray-500">{u.role}</span>
                        </li>
                    ))}
                </ul>
            </section>
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
