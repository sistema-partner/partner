import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import debounce from "lodash.debounce";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

export default function Curriculum({ auth, course }) {
    const { data, setData, patch, processing } = useForm({
        modules: [],
    });

    // Inicializar form com os dados do curso
    useEffect(() => {
        if (course.modules && course.modules.length > 0) {
            setData("modules", course.modules);
        }
    }, [course.id]);

    // ---- AUTOSAVE (debounce) ----
    const autosave = debounce(() => {
        // Valida se há módulos com pelo menos um título preenchido
        const hasValidModules = data.modules.some((m) => {
            // Módulo precisa ter título
            if (m.title.trim() === "") return false;

            // Se tem unidades, todas precisam ter título preenchido
            if (m.units && m.units.length > 0) {
                return m.units.every((u) => u.title.trim() !== "");
            }

            // Se não tem unidades, o módulo é válido
            return true;
        });

        if (hasValidModules) {
            patch(route("teacher.courses.curriculum.update", course.id), {
                preserveScroll: true,
                preserveState: true,
            });
        }
    }, 800);

    useEffect(() => {
        autosave();
        return autosave.cancel;
    }, [data.modules]);

    // ---- MODULES ----
    function addModule() {
        setData("modules", [
            ...data.modules,
            {
                title: "",
                description: "",
                order: data.modules.length + 1,
                units: [],
            },
        ]);
    }

    function updateModule(index, field, value) {
        const modules = [...data.modules];
        modules[index][field] = value;
        setData("modules", modules);
    }

    function removeModule(index) {
        const modules = [...data.modules];
        modules.splice(index, 1);
        setData(
            "modules",
            modules.map((m, i) => ({ ...m, order: i + 1 }))
        );
    }

    // ---- UNITS ----
    function addUnit(moduleIndex) {
        const modules = [...data.modules];
        modules[moduleIndex].units.push({
            title: "",
            type: "lesson",
            order: modules[moduleIndex].units.length + 1,
            is_optional: false,
        });
        setData("modules", modules);
    }

    function updateUnit(mIndex, uIndex, field, value) {
        const modules = [...data.modules];
        modules[mIndex].units[uIndex][field] = value;
        setData("modules", modules);
    }

    function removeUnit(mIndex, uIndex) {
        const modules = [...data.modules];
        modules[mIndex].units.splice(uIndex, 1);
        modules[mIndex].units = modules[mIndex].units.map((u, i) => ({
            ...u,
            order: i + 1,
        }));
        setData("modules", modules);
    }

    const unitTypeOptions = [
        { label: "Aula", value: "lesson" },
        { label: "Quiz", value: "quiz" },
        { label: "Projeto", value: "project" },
        { label: "Exercício", value: "code_exercise" },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Currículo do curso" />

            <div className="max-w-4xl mx-auto py-10">
                {/* Cabeçalho */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                        <i className="pi pi-list text-3xl text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Currículo
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Organize seus módulos e unidades de aprendizado
                    </p>
                </div>

                <Card className="shadow-lg border-0">
                    <div className="space-y-8">
                        {data.modules.map((module, mIndex) => (
                            <div key={mIndex}>
                                {/* Título do Módulo */}
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                        <i className="pi pi-bookmark text-blue-600 dark:text-blue-400"></i>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                            Módulo {mIndex + 1}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => removeModule(mIndex)}
                                        className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Remover módulo"
                                    >
                                        <i className="pi pi-trash"></i>
                                    </button>
                                </div>

                                <div className="space-y-4 ml-4">
                                    {/* Input de Título */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Título do módulo
                                        </label>
                                        <InputText
                                            type="text"
                                            className="w-full border border-light-border dark:border-dark-border rounded-lg bg-light-card dark:bg-dark-card px-4 py-2 text-light-foreground dark:text-dark-foreground"
                                            placeholder="Ex: Introdução ao React"
                                            value={module.title}
                                            onChange={(e) =>
                                                updateModule(
                                                    mIndex,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    {/* Input de Descrição */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Descrição
                                        </label>
                                        <InputTextarea
                                            rows={3}
                                            className="w-full border border-light-border dark:border-dark-border rounded-lg bg-light-card dark:bg-dark-card px-4 py-2 text-light-foreground dark:text-dark-foreground"
                                            placeholder="Descreva o conteúdo deste módulo"
                                            value={module.description ?? ""}
                                            onChange={(e) =>
                                                updateModule(
                                                    mIndex,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    {/* Unidades */}
                                    <div className="space-y-4 mt-6">
                                        <div className="flex items-center gap-2">
                                            <i className="pi pi-list text-gray-500 dark:text-gray-400"></i>
                                            <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                                                Unidades ({module.units.length})
                                            </h4>
                                        </div>

                                        <div className="space-y-3">
                                            {module.units.map(
                                                (unit, uIndex) => (
                                                    <div
                                                        key={uIndex}
                                                        className="flex gap-3 items-start bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-light-border dark:border-dark-border"
                                                    >
                                                        <div className="flex-1 space-y-3">
                                                            <InputText
                                                                type="text"
                                                                className="w-full border border-light-border dark:border-dark-border rounded-lg bg-light-card dark:bg-dark-card px-4 py-2 text-light-foreground dark:text-dark-foreground"
                                                                placeholder="Título da unidade"
                                                                value={
                                                                    unit.title
                                                                }
                                                                onChange={(e) =>
                                                                    updateUnit(
                                                                        mIndex,
                                                                        uIndex,
                                                                        "title",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />

                                                            <Dropdown
                                                                value={
                                                                    unit.type
                                                                }
                                                                onChange={(e) =>
                                                                    updateUnit(
                                                                        mIndex,
                                                                        uIndex,
                                                                        "type",
                                                                        e.value
                                                                    )
                                                                }
                                                                options={
                                                                    unitTypeOptions
                                                                }
                                                                optionLabel="label"
                                                                className="w-full"
                                                                pt={{
                                                                    root: {
                                                                        className:
                                                                            "w-full border border-light-border dark:border-dark-border rounded-lg bg-light-card dark:bg-dark-card",
                                                                    },
                                                                    input: {
                                                                        className:
                                                                            "text-light-foreground dark:text-dark-foreground",
                                                                    },
                                                                }}
                                                            />
                                                        </div>

                                                        <button
                                                            onClick={() =>
                                                                removeUnit(
                                                                    mIndex,
                                                                    uIndex
                                                                )
                                                            }
                                                            className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-1"
                                                            title="Remover unidade"
                                                        >
                                                            <i className="pi pi-trash"></i>
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <button
                                            onClick={() => addUnit(mIndex)}
                                            className="w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-dashed border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                        >
                                            <i className="pi pi-plus mr-2"></i>
                                            Adicionar unidade
                                        </button>
                                    </div>
                                </div>

                                {mIndex < data.modules.length - 1 && (
                                    <Divider className="my-8" />
                                )}
                            </div>
                        ))}

                        <div className="space-y-4 pt-6">
                            <button
                                onClick={addModule}
                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <i className="pi pi-plus"></i>
                                Adicionar módulo
                            </button>

                            {processing && (
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <i className="pi pi-spin pi-spinner"></i>
                                    Salvando…
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
