import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { X } from "lucide-react";

export default function ContentSelectModal({
    show,
    onClose,
    moduleIndex,
    onAttach,
}) {
    const [publicContents, setPublicContents] = useState([]);
    const [tab, setTab] = useState("new"); // new | public
    const { data, setData, reset, processing } = useForm({
        title: "",
        description: "",
        type: "video",
        file: null,
        url: "",
        is_public: false,
        content: "",
    });

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(route("contents.public"));
                const json = await res.json();
                setPublicContents(json.contents || []);
            } catch (e) {
                console.error("Falha ao carregar conteúdos públicos", e);
            }
        };
        if (show && publicContents.length === 0) {
            load();
        }
    }, [show]);

    if (!show) return null;

    const submitNew = (e) => {
        e.preventDefault();
        // Adiciona objeto estruturado ao módulo pai
        onAttach({
            title: data.title,
            description: data.description,
            type: data.type,
            is_public: data.is_public,
            file: data.file,
            url: data.url,
            content: data.content,
        });
        reset();
        onClose();
    };

    const attachExisting = (content) => {
        onAttach({
            id: content.id,
            title: content.title,
            type: content.type,
            existing: true,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Adicionar Conteúdo ao Módulo
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="px-6 pt-4 flex gap-4 border-b border-gray-200 dark:border-gray-700 text-sm font-medium">
                    <button
                        onClick={() => setTab("new")}
                        className={`pb-2 border-b-2 ${
                            tab === "new"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 dark:text-gray-400"
                        }`}
                    >
                        Novo Conteúdo
                    </button>
                    <button
                        onClick={() => setTab("public")}
                        className={`pb-2 border-b-2 ${
                            tab === "public"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 dark:text-gray-400"
                        }`}
                    >
                        Conteúdos Públicos
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {tab === "new" && (
                        <form onSubmit={submitNew} className="space-y-4 p-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                    Título
                                </label>
                                <input
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    className="mt-1 w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                    Descrição
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={3}
                                    className="mt-1 w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                        Tipo
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) =>
                                            setData("type", e.target.value)
                                        }
                                        className="mt-1 w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <option value="video">Vídeo</option>
                                        <option value="pdf">PDF</option>
                                        <option value="document">
                                            Documento
                                        </option>
                                        <option value="assignment">
                                            Atividade
                                        </option>
                                        <option value="quiz">Quiz</option>
                                        <option value="link">Link</option>
                                        <option value="text">Texto</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                        Público?
                                    </label>
                                    <select
                                        value={data.is_public ? "1" : "0"}
                                        onChange={(e) =>
                                            setData(
                                                "is_public",
                                                e.target.value === "1"
                                            )
                                        }
                                        className="mt-1 w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <option value="0">Privado</option>
                                        <option value="1">Público</option>
                                    </select>
                                </div>
                            </div>
                            {/* Campos condicionais por tipo */}
                            {[
                                "video",
                                "pdf",
                                "document",
                                "assignment",
                                "quiz",
                            ].includes(data.type) && (
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                        Arquivo
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) =>
                                            setData("file", e.target.files[0])
                                        }
                                        className="mt-1 w-full text-sm"
                                    />
                                </div>
                            )}
                            {data.type === "link" && (
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                        URL
                                    </label>
                                    <input
                                        value={data.url}
                                        onChange={(e) =>
                                            setData("url", e.target.value)
                                        }
                                        className="mt-1 w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                        placeholder="https://..."
                                    />
                                </div>
                            )}
                            {data.type === "text" && (
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                        Conteúdo em Texto
                                    </label>
                                    <textarea
                                        value={data.content}
                                        onChange={(e) =>
                                            setData("content", e.target.value)
                                        }
                                        rows={5}
                                        className="mt-1 w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </form>
                    )}
                    {tab === "public" && (
                        <div className="p-6 space-y-4">
                            {publicContents.length === 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Nenhum conteúdo público encontrado.
                                </p>
                            )}
                            <ul className="space-y-3">
                                {publicContents.map((c) => (
                                    <li
                                        key={c.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/40"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-100">
                                                {c.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {c.type} • Autor: {c.author} •
                                                ⭐ {c.average_rating}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => attachExisting(c)}
                                            className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                        >
                                            Anexar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
