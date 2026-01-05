import { Link, router } from "@inertiajs/react";
import {
    BookOpen,
    Users,
    Clock,
    AlertTriangle,
    BarChart3,
    PlusCircle,
    Eye,
    Grid3X3,
    List,
} from "lucide-react";
import GlassCard from "@/Components/GlassCard";
import ConfirmDialog from "@/Components/ConfirmDialog";
import CourseCard from "@/Components/CourseCard";
import { useState } from "react";

export default function TeacherDashboard({
    taughtCourses,
    pendingApprovals,
    isViewingAsStudent,
}) {
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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
            iconColor: "text-blue-primary",
            iconBg: "bg-blue-100 dark:bg-blue-primary/20",
            gradient: "from-blue-primary/10 via-blue-primary/5 to-transparent",
            ring: "ring-blue-primary/30",
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
            iconColor: "text-green-success",
            iconBg: "bg-green-100 dark:bg-green-success/20",
            gradient: "from-green-success/10 via-green-success/5 to-transparent",
            ring: "ring-green-success/30",
        },
    ];

    const handleDeleteCourse = (course) => {
        setCourseToDelete(course);
        setShowDeleteModal(true);
    };

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                className={`p-6 overflow-hidden bg-gradient-to-br ${gradient} dark:from-white/5 dark:via-white/5 dark:to-transparent ring-1 ${ring} dark:ring-white/10 backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]`}
                            >
                                <div className="pointer-events-none absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/30 dark:bg-white/5 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                                <div className="flex items-start justify-between relative">
                                    <div className="flex items-center">
                                        <span
                                            className={`mr-4 inline-flex items-center justify-center h-14 w-14 rounded-xl ${iconBg} ring-1 ring-inset ${
                                                ring.split(" ")[0]
                                            } backdrop-blur-sm`}
                                        >
                                            <Icon
                                                className={`h-7 w-7 ${iconColor}`}
                                            />
                                        </span>
                                        <div>
                                            <h3 className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                                                {label}
                                            </h3>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
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

            {/* Header dos cursos */}
            <GlassCard className="p-0" padding="sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <BookOpen className="h-6 w-6 text-blue-primary" /> 
                            Meus Cursos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Gerencie e acompanhe o desempenho dos seus cursos
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Toggle de visualização */}
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-colors ${
                                    viewMode === 'grid' 
                                        ? 'bg-white dark:bg-gray-700 shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-colors ${
                                    viewMode === 'list' 
                                        ? 'bg-white dark:bg-gray-700 shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>

                        <Link
                            href={route("teacher.courses.create")}
                            className="inline-flex items-center gap-2 px-4 py-3 bg-blue-primary hover:bg-blue-dark text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                            <PlusCircle className="h-5 w-5" /> 
                            <span className="hidden sm:inline">Novo Curso</span>
                        </Link>
                    </div>
                </div>

                {/* Lista de cursos */}
                <div className="p-6">
                    {taughtCourses.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Nenhum curso criado
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Crie seu primeiro curso para começar a gerenciar conteúdo e matrículas dos alunos.
                            </p>
                            <Link
                                href={route("teacher.courses.create")}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-primary hover:bg-blue-dark text-white font-semibold rounded-lg transition-colors"
                            >
                                <PlusCircle className="h-5 w-5" /> 
                                Criar Primeiro Curso
                            </Link>
                        </div>
                    ) : viewMode === 'grid' ? (
                        // Visualização em grid (estilo Udemy)
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {taughtCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    onDelete={handleDeleteCourse}
                                    isTeacher={true}
                                />
                            ))}
                        </div>
                    ) : (
                        // Visualização em lista (fallback)
                        <div className="space-y-4">
                            {taughtCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    onDelete={handleDeleteCourse}
                                    isTeacher={true}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </GlassCard>

            {/* Modal de confirmação de exclusão */}
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
                            ? Esta ação é permanente e não pode ser desfeita.
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
                            route("teacher.courses.destroy", courseToDelete.id),
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