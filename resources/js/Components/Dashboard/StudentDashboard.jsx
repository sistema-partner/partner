import { Link } from "@inertiajs/react";
import {
    BookOpen,
    Clock,
    CheckCircle,
    XCircle,
    UserCheck,
    BarChart3,
} from "lucide-react";
import GlassCard from "@/Components/GlassCard";
import CourseCodeEnrollModal from "@/Components/CourseCodeEnrollModal";
import { useState } from "react";

export default function StudentDashboard({
    enrolledCourses,
    pendingEnrollments,
}) {
    const [showCodeModal, setShowCodeModal] = useState(false);
    // Pré-cálculo de contagens para evitar filtros repetidos
    const activeCount = enrolledCourses.filter(
        (course) => course.status === "active"
    ).length;
    const plannedCount = enrolledCourses.filter(
        (course) => course.status === "planned"
    ).length;
    const endedCount = enrolledCourses.filter(
        (course) => course.status === "ended"
    ).length;
    const pendingCount = pendingEnrollments.length;

    const stats = [
        {
            key: "active",
            label: "Cursos Ativos",
            count: activeCount,
            icon: BookOpen,
            accent: "emerald",
            iconColor: "text-emerald-500",
            iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
            gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
            ring: "ring-emerald-500/30",
        },
        {
            key: "planned",
            label: "Cursos Futuros",
            count: plannedCount,
            icon: Clock,
            accent: "blue",
            iconColor: "text-blue-500",
            iconBg: "bg-blue-100 dark:bg-blue-500/20",
            gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
            ring: "ring-blue-500/30",
        },
        {
            key: "ended",
            label: "Cursos Concluídos",
            count: endedCount,
            icon: CheckCircle,
            accent: "gray",
            iconColor: "text-gray-500",
            iconBg: "bg-gray-100 dark:bg-gray-500/20",
            gradient: "from-gray-500/10 via-gray-500/5 to-transparent",
            ring: "ring-gray-500/30",
        },
        {
            key: "pending",
            label: "Matrículas Pendentes",
            count: pendingCount,
            icon: UserCheck,
            accent: "orange",
            iconColor: "text-orange-500",
            iconBg: "bg-orange-100 dark:bg-orange-500/20",
            gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
            ring: "ring-orange-500/30",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(
                    ({
                        key,
                        label,
                        count,
                        icon: Icon,
                        iconColor,
                        iconBg,
                        gradient,
                        ring,
                    }) => (
                        <div key={key} className="relative group">
                            <GlassCard
                                padding="sm"
                                className={`p-5 overflow-hidden bg-gradient-to-br ${gradient} dark:from-white/5 dark:via-white/3 dark:to-transparent ring-1 ${ring} dark:ring-white/10 backdrop-blur-sm transition-shadow group-hover:shadow-md`}
                            >
                                {/* Elemento decorativo */}
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
                                                {count}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    )
                )}
            </div>

            {/* Cursos Ativos */}
            <GlassCard className="p-0" padding="sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-green-500" />
                        Meus Cursos Ativos
                    </h2>
                    <button
                        type="button"
                        onClick={() => setShowCodeModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                    >
                        INSERIR CÓDIGO DE CURSO
                    </button>
                </div>
                <div className="p-6">
                    {enrolledCourses.filter(
                        (course) => course.status === "active"
                    ).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses
                                .filter((course) => course.status === "active")
                                .map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        type="active"
                                    />
                                ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={BookOpen}
                            title="Nenhum curso ativo"
                            description="Você não está matriculado em nenhum curso ativo no momento."
                            action={
                                <button
                                    type="button"
                                    onClick={() => setShowCodeModal(true)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                >
                                    INSERIR CÓDIGO DE CURSO
                                </button>
                            }
                        />
                    )}
                </div>
            </GlassCard>

            {/* Matrículas Pendentes */}
            {pendingEnrollments.length > 0 && (
                <GlassCard className="p-0" padding="sm">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-orange-500" />
                            Matrículas Pendentes de Aprovação
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {pendingEnrollments.map((enrollment) => (
                                <div
                                    key={enrollment.id}
                                    className="flex items-center justify-between p-4 border border-orange-200 dark:border-orange-300/40 rounded-lg bg-orange-50 dark:bg-orange-500/10"
                                >
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {enrollment.course.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Código: {enrollment.course.code}
                                        </p>
                                        <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                                            Aguardando aprovação do professor
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Solicitado em:{" "}
                                        {new Date(
                                            enrollment.requested_at
                                        ).toLocaleDateString("pt-BR")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            )}

            {/* Cursos Futuros */}
            <GlassCard className="p-0" padding="sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-500" />
                        Cursos Futuros
                    </h2>
                </div>
                <div className="p-6">
                    {enrolledCourses.filter(
                        (course) => course.status === "planned"
                    ).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses
                                .filter((course) => course.status === "planned")
                                .map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        type="planned"
                                    />
                                ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Clock}
                            title="Nenhum curso futuro"
                            description="Você não está matriculado em nenhum curso que começará em breve."
                        />
                    )}
                </div>
            </GlassCard>

            {/* Cursos Concluídos */}
            <GlassCard className="p-0" padding="sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-gray-500" />
                        Cursos Concluídos
                    </h2>
                </div>
                <div className="p-6">
                    {enrolledCourses.filter(
                        (course) => course.status === "ended"
                    ).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses
                                .filter((course) => course.status === "ended")
                                .map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        type="ended"
                                    />
                                ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={CheckCircle}
                            title="Nenhum curso concluído"
                            description="Você ainda não concluiu nenhum curso."
                        />
                    )}
                </div>
            </GlassCard>

            {/* Métricas de Progresso (Futuro - para o dashboard de metas) */}
            <GlassCard className="p-0" padding="sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                        Meu Progresso
                    </h2>
                </div>
                <div className="p-6">
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Em breve: Dashboard interativo com suas metas de
                            aprendizagem
                        </p>
                        <div className="flex justify-center gap-4 text-sm text-gray-400 dark:text-gray-500">
                            <span>📊 Gráficos de desempenho</span>
                            <span>🎯 Metas personalizadas</span>
                            <span>📈 Comparação com a turma</span>
                        </div>
                    </div>
                </div>
            </GlassCard>
            <CourseCodeEnrollModal
                show={showCodeModal}
                onClose={() => setShowCodeModal(false)}
            />
        </div>
    );
}

// Componente de Card de Curso
function CourseCard({ course, type }) {
    const getStatusColor = (status) => {
        const colors = {
            active: "bg-green-100 text-green-800",
            planned: "bg-blue-100 text-blue-800",
            ended: "bg-gray-100 text-gray-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getStatusText = (status) => {
        const texts = {
            active: "Ativo",
            planned: "Futuro",
            ended: "Concluído",
            cancelled: "Cancelado",
        };
        return texts[status] || status;
    };

    const getActionButton = (course, type) => {
        switch (type) {
            case "active":
                return (
                    <Link
                        href={route("courses.details", { course: course.id })}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700 transition-colors"
                    >
                        Acessar Curso
                    </Link>
                );
            case "planned":
                return (
                    <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded text-center cursor-not-allowed"
                    >
                        Início em{" "}
                        {new Date(course.start_date).toLocaleDateString(
                            "pt-BR"
                        )}
                    </button>
                );
            case "ended":
                return (
                    <Link
                        href={route("courses.details", { course: course.id })}
                        className="w-full bg-gray-600 text-white py-2 px-4 rounded text-center hover:bg-gray-700 transition-colors"
                    >
                        Ver Conteúdo
                    </Link>
                );
            default:
                return null;
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {(course.image_url || course.cover_url) && (
                <img
                    src={course.image_url || course.cover_url}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                />
            )}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                        {course.title}
                    </h3>
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            course.status
                        )}`}
                    >
                        {getStatusText(course.status)}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.description}
                </p>

                <div className="space-y-2 text-xs text-gray-500 mb-4">
                    <div className="flex justify-between">
                        <span>Código:</span>
                        <span className="font-mono">{course.code}</span>
                    </div>
                    {course.teacher && (
                        <div className="flex justify-between">
                            <span>Professor:</span>
                            <span>{course.teacher.name}</span>
                        </div>
                    )}
                    {course.start_date && (
                        <div className="flex justify-between">
                            <span>Início:</span>
                            <span>
                                {new Date(course.start_date).toLocaleDateString(
                                    "pt-BR"
                                )}
                            </span>
                        </div>
                    )}
                    {course.end_date && (
                        <div className="flex justify-between">
                            <span>Término:</span>
                            <span>
                                {new Date(course.end_date).toLocaleDateString(
                                    "pt-BR"
                                )}
                            </span>
                        </div>
                    )}
                </div>

                {getActionButton(course, type)}
            </div>
        </div>
    );
}

// Componente de Estado Vazio
function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="text-center py-8">
            <Icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                {description}
            </p>
            {action && action}
        </div>
    );
}
