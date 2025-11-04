import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import GlassCard from "@/Components/GlassCard";
import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowLeft, ClipboardCopy, ClipboardCheck } from "lucide-react";
import React from "react";

const EnrollmentButton = ({ course, enrollmentStatus }) => {
    const { flash } = usePage().props;

    if (enrollmentStatus) {
        if (enrollmentStatus.status === "pending") {
            return (
                <div className="mt-4 p-2 text-center bg-blue-100 text-blue-800 rounded-md">
                    Solicitação Pendente
                </div>
            );
        }
        if (enrollmentStatus.status === "approved") {
            return null;
        }
    }

    if (flash?.success) {
        return (
            <div className="mt-4 p-2 text-center bg-green-100 text-green-800 rounded-md">
                {flash.success}
            </div>
        );
    }
    if (flash?.error) {
        return (
            <div className="mt-4 p-2 text-center bg-red-100 text-red-800 rounded-md">
                {flash.error}
            </div>
        );
    }

    if (!course.accepts_enrollments) {
        return (
            <PrimaryButton className="mt-6 w-full justify-center" disabled>
                Matrículas Encerradas
            </PrimaryButton>
        );
    }

    return (
        <Link
            href={route("enrollments.store", course.id)}
            method="post"
            as="button"
            className="mt-6 w-full justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2"
        >
            Solicitar Inscrição
        </Link>
    );
};

export default function PublicShow({ auth, course, enrollmentStatus }) {
    const announcements = (course.contents || []).filter(
        (content) => content.type === "announcement"
    );
    const [copied, setCopied] = React.useState(false);
    const isEnrolled = enrollmentStatus?.status === "approved";

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(course.code);
        } catch (err) {
            try {
                const textarea = document.createElement("textarea");
                textarea.value = course.code;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            } catch (_) {}
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={course.title} />
            <div className="py-6">
                <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-6">
                    {/* Header */}
                    <div className="mb-2">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-800/60 transition"
                        >
                            <ArrowLeft size={14} /> Voltar
                        </button>
                        <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                            {course.title}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Por {course.teacher.name}
                        </p>
                    </div>

                    {/* Detalhes do Curso */}
                    <GlassCard>
                        {(course.cover_url || course.image_url) && (
                            <div className="mb-6 -mt-2 -mx-2">
                                <div className="rounded-lg overflow-hidden h-56 relative">
                                    <img
                                        src={
                                            course.cover_url || course.image_url
                                        }
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {course.image_url && course.cover_url && (
                                        <img
                                            src={course.image_url}
                                            alt={course.title}
                                            className="absolute bottom-4 left-4 h-16 w-16 object-cover rounded-lg ring-2 ring-white shadow-lg"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Título
                                </h3>
                                <p className="mt-1 text-gray-900 dark:text-gray-100 font-semibold">
                                    {course.title}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Código
                                </h3>
                                <div className="mt-1 flex items-center gap-2">
                                    <p className="font-mono text-indigo-600 dark:text-indigo-400">
                                        {course.code}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleCopyCode}
                                        className="inline-flex items-center gap-1 rounded-md border border-indigo-300/60 dark:border-indigo-600/40 bg-indigo-50/60 dark:bg-indigo-900/40 px-2 py-1 text-[10px] font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/70 dark:hover:bg-indigo-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-1 shadow-sm transition-colors"
                                        aria-label="Copiar código do curso"
                                    >
                                        {copied ? (
                                            <ClipboardCheck size={14} />
                                        ) : (
                                            <ClipboardCopy size={14} />
                                        )}
                                        {copied ? "Copiado!" : "Copiar"}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Status
                                </h3>
                                <p className="mt-1 text-gray-700 dark:text-gray-300 capitalize">
                                    {course.status}
                                </p>
                            </div>
                            <div className="md:col-span-3">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Descrição
                                </h3>
                                <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {course.description}
                                </p>
                                {auth.user.role === "student" && (
                                    <div className="mt-4">
                                        <EnrollmentButton
                                            course={course}
                                            enrollmentStatus={enrollmentStatus}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </GlassCard>

                    {/* Módulos */}
                    {course.modules && course.modules.length > 0 && (
                        <GlassCard
                            title="Módulos do Curso"
                            description="Estrutura de aprendizagem e materiais disponíveis."
                        >
                            <div className="space-y-6">
                                {course.modules.map((module) => (
                                    <div
                                        key={module.id}
                                        className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {module.title}
                                                </h4>
                                                {module.description && (
                                                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                                                        {module.description}
                                                    </p>
                                                )}
                                            </div>
                                            {module.is_public ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border border-green-200/60 dark:border-green-700/60">
                                                    Público
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-300/60 dark:border-gray-600/60">
                                                    Privado
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            {module.contents &&
                                            module.contents.length > 0 ? (
                                                module.contents.map(
                                                    (content) => (
                                                        <div
                                                            key={content.id}
                                                            className="group border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                                                                            {
                                                                                content.type
                                                                            }
                                                                        </span>
                                                                        {content.is_public && (
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                                                                Público
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <h5 className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                        {
                                                                            content.title
                                                                        }
                                                                    </h5>
                                                                    {content.description && (
                                                                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                                                                            {
                                                                                content.description
                                                                            }
                                                                        </p>
                                                                    )}
                                                                    {content.type ===
                                                                        "text" &&
                                                                        content.content && (
                                                                            <p className="mt-2 text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                                                {
                                                                                    content.content
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    {content.type ===
                                                                        "link" &&
                                                                        content.url && (
                                                                            <p className="mt-2 text-xs">
                                                                                <a
                                                                                    href={
                                                                                        content.url
                                                                                    }
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                                                                                >
                                                                                    {
                                                                                        content.url
                                                                                    }
                                                                                </a>
                                                                            </p>
                                                                        )}
                                                                    {content.file_path && (
                                                                        <div className="mt-2">
                                                                            <a
                                                                                href={`/storage/${content.file_path}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:underline"
                                                                            >
                                                                                <ClipboardCopy
                                                                                    size={
                                                                                        12
                                                                                    }
                                                                                />{" "}
                                                                                Abrir
                                                                                arquivo
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {content.user && (
                                                                    <div className="text-right">
                                                                        <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold">
                                                                            Autor
                                                                        </p>
                                                                        <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                                                                            {
                                                                                content
                                                                                    .user
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Nenhum conteúdo neste
                                                    módulo.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    {/* Mural de Avisos */}
                    <GlassCard
                        title="Mural de Avisos"
                        description="Comunicados do curso."
                    >
                        <div className="space-y-6">
                            {announcements.length > 0 ? (
                                announcements.map((content) => (
                                    <div
                                        key={content.id}
                                        className="pt-4 border-t border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                            <span>
                                                Postado por:{" "}
                                                <strong className="text-gray-700 dark:text-gray-300 font-medium">
                                                    {content.author.name}
                                                </strong>
                                            </span>
                                            <span>
                                                {new Date(
                                                    content.created_at
                                                ).toLocaleString("pt-BR")}
                                            </span>
                                        </div>
                                        <p className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                            {content.body}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Nenhum aviso postado ainda.
                                </p>
                            )}
                        </div>
                    </GlassCard>

                    <div className="flex justify-end">
                        <button
                            onClick={() => window.history.back()}
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        >
                            &larr; Voltar
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
