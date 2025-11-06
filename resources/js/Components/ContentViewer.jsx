import GlassCard from "@/Components/GlassCard";
import { useEffect } from "react";

// Unified content viewer component
// Props: content (object with type, title, body, url, file_path, content, description)
// Renders internally without leaving the app.
export default function ContentViewer({ content }) {
    if (!content) return null;
    const { type } = content;

    return (
        <GlassCard
            title={content.title || "Conteúdo"}
            description={content.description}
        >
            <div className="space-y-4">
                {type === "video" && content.url && (
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                        <iframe
                            src={content.url}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={content.title || "Vídeo"}
                        />
                    </div>
                )}
                {type === "pdf" && content.file_path && (
                    <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700 text-xs">
                            <span className="font-medium text-gray-700 dark:text-gray-200">Visualização de PDF</span>
                            <div className="space-x-3">
                                <a
                                    href={`/storage/${content.file_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    Abrir em nova aba
                                </a>
                                <a
                                    href={`/storage/${content.file_path}`}
                                    download
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                        <div className="h-[70vh]">
                            {/* Use object for better PDF compatibility; fallback shows message if plugin unavailable */}
                            <object
                                data={`/storage/${content.file_path}#toolbar=0`}
                                type="application/pdf"
                                className="w-full h-full"
                            >
                                <div className="p-4 text-center text-sm text-gray-600 dark:text-gray-300">
                                    Não foi possível incorporar o PDF aqui. Clique em "Abrir em nova aba" ou "Download" acima para visualizar.
                                </div>
                            </object>
                        </div>
                    </div>
                )}
                {type === "text" && content.content && (
                    <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                        {content.content}
                    </div>
                )}
                {type === "link" && content.url && (
                    <div className="text-sm">
                        <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                            Link Externo
                        </p>
                        <a
                            href={content.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                        >
                            {content.url}
                        </a>
                    </div>
                )}
                {type === "announcement" && content.body && (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {content.body}
                    </div>
                )}
                {/* Fallback for unknown type */}
                {!["video", "pdf", "text", "link", "announcement"].includes(
                    type
                ) && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Tipo de conteúdo não suportado.
                    </div>
                )}
            </div>
        </GlassCard>
    );
}
