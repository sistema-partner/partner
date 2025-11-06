import { useState } from "react";
import ContentSelectModal from "@/Components/ContentSelectModal";
import { Trash2, Plus, Edit3, Check, X, Layers, FilePlus2 } from "lucide-react";

/**
 * CourseModulesBuilder
 * Props:
 *  - modules: Array<{title, description, contents: []}>
 *  - onChange: (modules) => void
 */
export default function CourseModulesBuilder({ modules, onChange }) {
    const [showContentModal, setShowContentModal] = useState(false);
    const [activeModuleIndex, setActiveModuleIndex] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);

    const addModule = () => {
        onChange([...modules, { title: "", description: "", contents: [] }]);
        setEditingIndex(modules.length); // auto-edit novo
    };

    const updateModuleField = (index, field, value) => {
        const clone = [...modules];
        clone[index] = { ...clone[index], [field]: value };
        onChange(clone);
    };

    const removeModule = (index) => {
        const clone = modules.filter((_, i) => i !== index);
        onChange(clone);
        if (editingIndex === index) setEditingIndex(null);
    };

    const openContentModal = (index) => {
        setActiveModuleIndex(index);
        setShowContentModal(true);
    };

    const attachContentToModule = (content) => {
        const clone = [...modules];
        clone[activeModuleIndex].contents.push(content);
        onChange(clone);
    };

    const toggleEdit = (index) => {
        setEditingIndex(editingIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Módulos
                </h2>
                <button
                    type="button"
                    onClick={addModule}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                >
                    <Plus className="h-4 w-4" /> Novo Módulo
                </button>
            </div>
            {modules.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum módulo adicionado ainda.
                </p>
            )}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((m, idx) => {
                    const isEditing = editingIndex === idx;
                    return (
                        <div
                            key={idx}
                            className="relative flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm shadow-sm hover:shadow-md transition group"
                        >
                            {/* Header */}
                            <div className="px-4 pt-4 pb-2 flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    {isEditing ? (
                                        <input
                                            value={m.title}
                                            onChange={(e) =>
                                                updateModuleField(
                                                    idx,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`Título do Módulo ${
                                                idx + 1
                                            }`}
                                            className="w-full text-sm font-semibold rounded border border-indigo-300 dark:border-indigo-600 bg-indigo-50/60 dark:bg-indigo-900/40 px-2 py-1 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                            {m.title || `Módulo ${idx + 1}`}
                                        </h4>
                                    )}
                                    {isEditing ? (
                                        <textarea
                                            value={m.description}
                                            onChange={(e) =>
                                                updateModuleField(
                                                    idx,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Descrição do módulo"
                                            rows={2}
                                            className="mt-2 w-full text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        m.description && (
                                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {m.description}
                                            </p>
                                        )
                                    )}
                                </div>
                                <div className="flex flex-col gap-1 ml-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleEdit(idx)}
                                        className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/60 transition"
                                        title={
                                            isEditing
                                                ? "Concluir edição"
                                                : "Editar"
                                        }
                                    >
                                        {isEditing ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Edit3 className="h-4 w-4" />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeModule(idx)}
                                        className="p-1 rounded-md bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/60 transition"
                                        title="Remover módulo"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            {/* Contents */}
                            <div className="px-4 pb-4 mt-2 flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        Conteúdos
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => openContentModal(idx)}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-[11px] rounded shadow-sm transition"
                                    >
                                        <FilePlus2 className="h-3 w-3" />{" "}
                                        Adicionar
                                    </button>
                                </div>
                                {m.contents.length === 0 ? (
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        Nenhum conteúdo.
                                    </p>
                                ) : (
                                    <ul className="space-y-1">
                                        {m.contents.map((c, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-[11px]"
                                            >
                                                <span
                                                    className="truncate max-w-[65%]"
                                                    title={c.title}
                                                >
                                                    {c.title}
                                                </span>
                                                <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium uppercase tracking-wide text-[10px]">
                                                    {c.type}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {/* Editing overlay indicator */}
                            {isEditing && (
                                <div className="absolute inset-0 pointer-events-none ring-2 ring-indigo-400/60 rounded-xl" />
                            )}
                        </div>
                    );
                })}
            </div>
            <ContentSelectModal
                show={showContentModal}
                onClose={() => setShowContentModal(false)}
                moduleIndex={activeModuleIndex}
                onAttach={attachContentToModule}
            />
        </div>
    );
}
