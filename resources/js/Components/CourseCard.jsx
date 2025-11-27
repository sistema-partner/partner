import { Link } from "@inertiajs/react";
import {
    Users,
    Clock,
    Star,
    BarChart3,
    Trash2,
    Edit3,
    Eye,
} from "lucide-react";

const CourseCard = ({ course, onDelete, isTeacher = true }) => {
    console.log(course)
    const getStatusBadge = (status) => {
        const statusConfig = {
            planned: {
                label: "Planejado",
                class: "bg-blue-100 text-blue-primary dark:bg-blue-darker/70 dark:text-blue-light",
            },
            active: {
                label: "Ativo",
                class: "bg-green-100 text-green-success dark:bg-green-dark/70 dark:text-green-success",
            },
            ended: {
                label: "Concluído",
                class: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
            },
        };

        const config = statusConfig[status] || statusConfig.planned;
        return (
            <span
                className={`px-2 py-1 rounded-full text-[0.8rem] font-medium ${config.class}`}
            >
                {config.label}
            </span>
        );
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return "text-green-success";
        if (rating >= 4.0) return "text-yellow-500";
        if (rating >= 3.5) return "text-orange-500";
        return "text-red-500";
    };

    return (
        <Link
            href={route("courses.show", course.id)}
            className="block bg-white dark:bg-dark-card rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-dark-border group overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-primary"
        >
            {/* Imagem do curso */}
            <div className="relative overflow-hidden">
                <img
                    src={
                        course.image_url ||
                        "/default-course-image.jpg"
                    }
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                    {getStatusBadge(course.status)}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Overlay gradiente usando roxo da paleta */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-purple-dark/20 to-transparent" />
            </div>

            {/* Conteúdo do card */}
            <div className="p-4 min-h-[260px] flex flex-col">
                {/* Título e descrição */}
                <h3 className="font-bold text-xl text-gray-900 dark:text-dark-foreground line-clamp-2 mb-2 group-hover:text-purple-light transition-colors">
                    {course.title}
                </h3>
                <p className="text-gray-600 dark:text-dark-muted-foreground text-[0.95rem] line-clamp-2 mb-3">
                    {course.description || "Sem descrição disponível"}
                </p>

                {/* Metadados */}
                <div className="flex items-center justify-between text-[0.95rem] text-gray-500 dark:text-dark-muted-foreground mb-3">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-purple-light" />
                            <span>
                                {course.active_enrollments_count || 0} alunos
                            </span>
                        </div>
                        {course.duration && (
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-green-success" />
                                <span>{course.duration}</span>
                            </div>
                        )}
                    </div>

                    {/* Rating (se disponível) */}
                    {course.average_rating && (
                        <div className="flex items-center gap-1">
                            <div className="flex items-center">
                                <Star
                                    className={`h-4 w-4 fill-current ${getRatingColor(
                                        course.average_rating
                                    )}`}
                                />
                                <span
                                    className={`font-semibold ml-1 ${getRatingColor(
                                        course.average_rating
                                    )}`}
                                >
                                    {course.average_rating}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Progresso (para alunos) ou estatísticas (para professores) */}
                {!isTeacher && course.progress !== undefined && (
                    <div className="mb-3">
                        <div className="flex justify-between text-[0.75rem] text-gray-500 dark:text-dark-muted-foreground mb-1">
                            <span>Progresso</span>
                            <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-green-success h-2 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {isTeacher && (
                    <div className="flex items-center gap-4 text-[0.9rem] text-gray-500 dark:text-dark-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-purple-light rounded-full" />
                            <span>{course.modules_count || 0} módulos</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-success rounded-full" />
                            <span>{course.lessons_count || 0} aulas</span>
                        </div>
                    </div>
                )}

                {/* Datas */}
                <div className="flex flex-wrap gap-2 text-[0.9rem] text-gray-500 dark:text-dark-muted-foreground mb-4">
                    {course.start_date && (
                        <span className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-blue-primary rounded-full" />
                            Início:{" "}
                            {new Date(course.start_date).toLocaleDateString(
                                "pt-BR",
                                {
                                    timeZone: "UTC",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                }
                            )}
                        </span>
                    )}
                    {course.end_date && (
                        <span className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-purple-light rounded-full" />
                            Término:{" "}
                            {new Date(course.end_date).toLocaleDateString(
                                "pt-BR",
                                {
                                    timeZone: "UTC",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                }
                            )}
                        </span>
                    )}
                </div>

                {/* Ações */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-border">
                    {isTeacher ? (
                        <>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route("courses.edit", course.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 px-3 py-2 bg-blue-primary hover:bg-blue-dark text-white text-[0.8rem] font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
                                >
                                    <Edit3 className="h-3 w-3" />
                                    Editar
                                </Link>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(course);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-[0.8rem] font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
                            >
                                <Trash2 className="h-3 w-3" />
                                Excluir
                            </button>
                        </>
                    ) : (
                        <Link
                            href={route("courses.show", course.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-primary to-purple-light hover:from-blue-dark hover:to-purple-dark text-white font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <BarChart3 className="h-4 w-4" />
                            {course.progress > 0 ? "Continuar" : "Começar"}
                        </Link>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
