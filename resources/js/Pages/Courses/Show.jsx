import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import GlassCard from "@/Components/GlassCard";
import { useState } from "react";
import { ClipboardCopy, ClipboardCheck, Check, X } from "lucide-react";

const AnnouncementForm = ({ course }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        body: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("courses.contents.store", course.id), {
            onSuccess: () => reset(), // Limpa o formulário após o sucesso
        });
    };

    return (
        <form onSubmit={submit} className="space-y-3">
            <textarea
                value={data.body}
                onChange={(e) => setData("body", e.target.value)}
                placeholder="Escreva um aviso para a turma..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                rows="3"
            />
            {errors.body && (
                <p className="text-sm text-red-600">{errors.body}</p>
            )}
            <div className="flex justify-end">
                <PrimaryButton disabled={processing}>
                    Postar Aviso
                </PrimaryButton>
            </div>
        </form>
    );
};

const EnrollmentStatusBadge = ({ status }) => {
    const statusClasses = {
        pending:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        approved:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        cancelled:
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
    const statusText = {
        pending: "Pendente",
        approved: "Aprovado",
        rejected: "Rejeitado",
        cancelled: "Cancelado",
    };
    return (
        <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}
        >
            {statusText[status] || status}
        </span>
    );
};

export default function Show({ auth, course }) {
    const pendingEnrollments = course.enrollments.filter(
        (e) => e.status === "pending"
    );
    const otherEnrollments = course.enrollments.filter(
        (e) => e.status !== "pending"
    );
    const [copied, setCopied] = useState(false);

    // Formata diferença de tempo (simples)
    const formatRelative = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const mins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMs / 3600000);
        const days = Math.floor(diffMs / 86400000);
        if (mins < 1) return "agora";
        if (mins < 60) return `${mins}m atrás`;
        if (hours < 24) return `${hours}h atrás`;
        if (days < 7) return `${days}d atrás`;
        return date.toLocaleDateString("pt-BR");
    };

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(course.code);
        } catch (err) {
            // Fallback para navegadores antigos
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
            } catch (_) {
                /* ignore */
            }
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={course.title} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Header da página */}
                    <div className="mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {course.title}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Gerencie informações, avisos e matrículas deste
                            curso.
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
                            </div>
                        </div>
                    </GlassCard>

                    {/* Módulos e Conteúdos (movido para cima) */}
                    {course.modules && course.modules.length > 0 ? (
                        <GlassCard
                            title="Módulos do Curso"
                            description="Estrutura de aprendizagem e materiais associados."
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

                                        {/* Lista de conteúdos do módulo */}
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
                                                                    {/* Tipo específico de renderização */}
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
                    ) : null}

                    <GlassCard
                        title="Matrículas"
                        description="Gerencie solicitações pendentes e acompanhe o status dos alunos."
                    >
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            Solicitações Pendentes
                        </h3>
                        {pendingEnrollments.length > 0 ? (
                            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {pendingEnrollments.map((enrollment) => (
                                    <div
                                        key={enrollment.id}
                                        className="group relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                                                    {enrollment.student.name
                                                        .slice(0, 2)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                                                        {
                                                            enrollment.student
                                                                .name
                                                        }
                                                    </p>
                                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 break-all">
                                                        {
                                                            enrollment.student
                                                                .email
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <EnrollmentStatusBadge
                                                status={enrollment.status}
                                            />
                                        </div>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">
                                            Solicitado{" "}
                                            {formatRelative(
                                                enrollment.created_at
                                            )}
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            <Link
                                                as="button"
                                                href={route(
                                                    "enrollments.approve",
                                                    enrollment.id
                                                )}
                                                method="post"
                                                className="inline-flex items-center justify-center gap-1 rounded-md bg-green-600/90 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white text-xs font-semibold px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:ring-offset-1 transition-colors"
                                            >
                                                <Check size={14} /> Aprovar
                                            </Link>
                                            <Link
                                                as="button"
                                                href={route(
                                                    "enrollments.reject",
                                                    enrollment.id
                                                )}
                                                method="post"
                                                className="inline-flex items-center justify-center gap-1 rounded-md bg-red-600/90 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white text-xs font-semibold px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:ring-offset-1 transition-colors"
                                            >
                                                <X size={14} /> Rejeitar
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mb-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-6 text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Nenhuma solicitação de matrícula pendente no
                                    momento.
                                </p>
                            </div>
                        )}

                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 mt-2">
                            Outras Matrículas
                        </h3>
                        {otherEnrollments.length > 0 ? (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {otherEnrollments.map((enrollment) => (
                                    <li
                                        key={enrollment.id}
                                        className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {enrollment.student.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {enrollment.student.email}
                                            </p>
                                        </div>
                                        <EnrollmentStatusBadge
                                            status={enrollment.status}
                                        />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Nenhuma outra matrícula encontrada.
                            </p>
                        )}
                    </GlassCard>

                    {/* Mural de Avisos */}
                    <GlassCard
                        title="Mural de Avisos"
                        description="Envie comunicados rápidos para os alunos matriculados."
                    >
                        <div className="mb-6">
                            <AnnouncementForm course={course} />
                        </div>
                        <div className="space-y-6">
                            {course.contents
                                .filter((c) => c.type === "announcement")
                                .map((content) => (
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
                                ))}
                            {course.contents.filter(
                                (c) => c.type === "announcement"
                            ).length === 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Nenhum aviso postado ainda.
                                </p>
                            )}
                        </div>
                    </GlassCard>

                    <div className="flex justify-end">
                        <Link
                            href={route("dashboard")}
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        >
                            &larr; Voltar para o Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
