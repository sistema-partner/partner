import { Link, router } from "@inertiajs/react";
import {
    BookOpen,
    Users,
    Clock,
    AlertTriangle,
    BarChart3,
    PlusCircle,
    Eye,
    Trash2,
} from "lucide-react";
import GlassCard from "@/Components/GlassCard";
import ConfirmDialog from "@/Components/ConfirmDialog";
import { useState } from "react";

export default function TeacherDashboard({
    taughtCourses,
    pendingApprovals,
    isViewingAsStudent,
}) {
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const totalStudents = taughtCourses.reduce(
        (total, course) => total + course.active_enrollments_count,
        0
    );

    const stats = [
        {
            key: "courses",
            label: "Total de Cursos",
            value: taughtCourses.length,
            icon: BookOpen,
            iconColor: "text-indigo-500",
            iconBg: "bg-indigo-100 dark:bg-indigo-500/20",
            gradient: "from-indigo-500/10 via-indigo-500/5 to-transparent",
            ring: "ring-indigo-500/30",
        },
        {
            key: "pending",
            label: "Solicitações Pendentes",
            value: pendingApprovals.length,
            icon: AlertTriangle,
            iconColor: "text-orange-500",
            iconBg: "bg-orange-100 dark:bg-orange-500/20",
            gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
            ring: "ring-orange-500/30",
        },
        {
            key: "students",
            label: "Alunos Ativos",
            value: totalStudents,
            icon: Users,
            iconColor: "text-green-600",
            iconBg: "bg-green-100 dark:bg-green-500/20",
            gradient: "from-green-500/10 via-green-500/5 to-transparent",
            ring: "ring-green-500/30",
        },
    ];

    console.log(taughtCourses)

    return (
        <div className="space-y-6">
            {isViewingAsStudent && (
                <GlassCard
                    padding="sm"
                    className="border border-blue-300/40 dark:border-blue-400/30 bg-blue-50/60 dark:bg-blue-900/30"
                >
                    <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                        <Eye className="h-5 w-5" /> Visualização como Aluno
                        Ativa
                    </h2>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        Você está vendo o dashboard com a visão de um aluno. Use
                        esta ferramenta para verificar como seus cursos aparecem
                        para os estudantes.
                    </p>
                </GlassCard>
            )}

            {/* Estatísticas rápidas */}
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

            {/* Lista de cursos */}
            <GlassCard className="p-0" padding="sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-indigo-500" /> Meus
                        Cursos
                    </h2>
                    <Link
                        href={route("courses.create")}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md transition"
                    >
                        <PlusCircle className="h-4 w-4" /> Novo Curso
                    </Link>
                </div>
                <div className="p-6">
                    {taughtCourses.length === 0 ? (
                        <div className="text-center py-10">
                            <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Nenhum curso criado
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                                Crie seu primeiro curso para começar a gerenciar
                                conteúdo e matrículas dos alunos.
                            </p>
                            <Link
                                href={route("courses.create")}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md transition"
                            >
                                <PlusCircle className="h-4 w-4" /> Criar Curso
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {taughtCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-sm transition flex gap-4"
                                >
                                    {(course.image_path ||
                                        course.cover_path) && (
                                        <div className="w-32 h-24 rounded-md overflow-hidden flex-shrink-0">
                                            <img
                                                src={course.image_url || course.cover_url || '/default-course-image.jpg'}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                                {course.title}
                                                {course.status ===
                                                    "planned" && (
                                                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-medium">
                                                        Planejado
                                                    </span>
                                                )}
                                                {course.status === "active" && (
                                                    <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs font-medium">
                                                        Ativo
                                                    </span>
                                                )}
                                                {course.status === "ended" && (
                                                    <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 text-xs font-medium">
                                                        Concluído
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm line-clamp-2">
                                                {course.description}
                                            </p>
                                            <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span>
                                                    Alunos:{" "}
                                                    {
                                                        course.active_enrollments_count
                                                    }
                                                </span>
                                                {course.start_date && (
                                                    <span>
                                                        Início:{" "}
                                                        {new Date(
                                                            course.start_date
                                                        ).toLocaleDateString(
                                                            "pt-BR"
                                                        )}
                                                    </span>
                                                )}
                                                {course.end_date && (
                                                    <span>
                                                        Término:{" "}
                                                        {new Date(
                                                            course.end_date
                                                        ).toLocaleDateString(
                                                            "pt-BR"
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Link
                                                href={route(
                                                    "courses.show",
                                                    course.id
                                                )}
                                                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                                            >
                                                Ver
                                            </Link>
                                            <Link
                                                href={route(
                                                    "courses.edit",
                                                    course.id
                                                )}
                                                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCourseToDelete(course);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/40 rounded"
                                            >
                                                <Trash2 className="h-4 w-4" />{" "}
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </GlassCard>
            <ConfirmDialog
                show={showDeleteModal}
                title="Excluir Curso"
                message={
                    courseToDelete && (
                        <>
                            Tem certeza que deseja excluir o curso{" "}
                            <span className="font-semibold text-gray-900 dark:text-gray-200">
                                "{courseToDelete.title}"
                            </span>
                            ? Esta ação é permanente.
                        </>
                    )
                }
                confirmLabel="Excluir"
                cancelLabel="Cancelar"
                variant="danger"
                onClose={() => {
                    setShowDeleteModal(false);
                    setCourseToDelete(null);
                }}
                onConfirm={() =>
                    new Promise((resolve) => {
                        if (!courseToDelete) return resolve();
                        router.delete(
                            route("courses.destroy", courseToDelete.id),
                            {
                                preserveScroll: true,
                                onSuccess: () => {
                                    setShowDeleteModal(false);
                                    setCourseToDelete(null);
                                },
                                onFinish: () => resolve(),
                            }
                        );
                    })
                }
            />
        </div>
    );
}
