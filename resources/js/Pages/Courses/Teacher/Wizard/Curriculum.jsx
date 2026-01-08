import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

export default function Curriculum({ auth, course }) {
    // Inicializar form com os dados do curso de forma sincronizada
    const normalizedModules =
        course.modules && course.modules.length > 0
            ? course.modules.map((module) => ({
                  ...module,
                  units: (module.units || []).map((unit) => ({
                      ...unit,
                      content: unit.content || {
                          source: "upload",
                          type: "video",
                          file: null,
                          libraryContent: null,
                          url: "",
                          text: "",
                      },
                  })),
              }))
            : [];

    const { data, setData, post, processing, errors } = useForm({
        modules: normalizedModules,
    });

    function submit(e) {
        e.preventDefault();

        post(route("teacher.courses.curriculum.update", course.id), {
            _method: "PATCH",
        });
    }

    // ---- MODULES ----
    function addModule() {
        setData("modules", [
            ...data.modules,
            {
                id: null,
                title: "",
                description: "",
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
        setData("modules", modules);
    }

    // ---- UNITS ----
    function addUnit(moduleIndex) {
        const modules = [...data.modules];

        modules[moduleIndex].units.push({
            id: null,
            title: "",
            type: "lesson",
            is_optional: false,
            content: {
                source: "upload", // 'upload' ou 'library'
                type: "video", // 'video', 'pdf', 'document', 'link', 'text'
                file: null,
                libraryContent: null,
                url: "",
                text: "",
            },
        });
        setData("modules", modules);
    }

    function updateUnit(mIndex, uIndex, field, value) {
        const modules = [...data.modules];
        modules[mIndex].units[uIndex][field] = value;
        setData("modules", modules);
    }

    function updateUnitContent(mIndex, uIndex, field, value) {
        const modules = [...data.modules];
        modules[mIndex].units[uIndex].content[field] = value;
        setData("modules", modules);
    }

    function removeUnit(mIndex, uIndex) {
        const modules = [...data.modules];
        modules[mIndex].units.splice(uIndex, 1);
        setData("modules", modules);
    }

    const unitTypeOptions = [
        { label: "Aula", value: "lesson" },
        { label: "Quiz", value: "quiz" },
        { label: "Projeto", value: "project" },
        { label: "Exercício", value: "code_exercise" },
    ];

    const contentTypeOptions = [
        { label: "Vídeo", value: "video" },
        { label: "PDF", value: "pdf" },
        { label: "Documento", value: "document" },
        { label: "Link", value: "link" },
        { label: "Texto", value: "text" },
    ];

    const sourceOptions = [
        { label: "Upload", value: "upload" },
        { label: "Biblioteca", value: "library" },
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
                    <form onSubmit={submit} className="">
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
                                                    Unidades (
                                                    {module.units.length})
                                                </h4>
                                            </div>

                                            <div className="space-y-3">
                                                {module.units.map(
                                                    (unit, uIndex) => (
                                                        <div
                                                            key={uIndex}
                                                            className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-light-border dark:border-dark-border"
                                                        >
                                                            {/* Informações básicas da unidade */}
                                                            <div className="flex gap-3 items-start">
                                                                <div className="flex-1 space-y-3">
                                                                    <InputText
                                                                        type="text"
                                                                        className="w-full border border-light-border dark:border-dark-border rounded-lg bg-light-card dark:bg-dark-card px-4 py-2 text-light-foreground dark:text-dark-foreground"
                                                                        placeholder="Título da unidade"
                                                                        value={
                                                                            unit.title
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateUnit(
                                                                                mIndex,
                                                                                uIndex,
                                                                                "title",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />

                                                                    <Dropdown
                                                                        value={
                                                                            unit.type
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
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

                                                            {/* Conteúdo da unidade (apenas para aulas) */}
                                                            {unit.type ===
                                                                "lesson" && (
                                                                <div className="pt-4 border-t border-light-border dark:border-dark-border space-y-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <i className="pi pi-file text-gray-500 dark:text-gray-400"></i>
                                                                        <h5 className="font-medium text-gray-700 dark:text-gray-300">
                                                                            Conteúdo
                                                                            da
                                                                            Aula
                                                                        </h5>
                                                                    </div>

                                                                    {/* Tipo de conteúdo */}
                                                                    <div className="space-y-2">
                                                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                                            Tipo
                                                                            de
                                                                            Conteúdo
                                                                        </label>
                                                                        <Dropdown
                                                                            value={
                                                                                unit
                                                                                    .content
                                                                                    .type
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateUnitContent(
                                                                                    mIndex,
                                                                                    uIndex,
                                                                                    "type",
                                                                                    e.value
                                                                                )
                                                                            }
                                                                            options={
                                                                                contentTypeOptions
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

                                                                    {/* Fonte de conteúdo */}
                                                                    <div className="space-y-2">
                                                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                                            Fonte
                                                                        </label>
                                                                        <Dropdown
                                                                            value={
                                                                                unit
                                                                                    .content
                                                                                    .source
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateUnitContent(
                                                                                    mIndex,
                                                                                    uIndex,
                                                                                    "source",
                                                                                    e.value
                                                                                )
                                                                            }
                                                                            options={
                                                                                sourceOptions
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

                                                                    {/* Campos dinâmicos baseado no tipo */}
                                                                    {unit
                                                                        .content
                                                                        .source ===
                                                                    "upload" ? (
                                                                        <>
                                                                            {(unit
                                                                                .content
                                                                                .type ===
                                                                                "video" ||
                                                                                unit
                                                                                    .content
                                                                                    .type ===
                                                                                    "pdf" ||
                                                                                unit
                                                                                    .content
                                                                                    .type ===
                                                                                    "document") && (
                                                                                <div className="space-y-2">
                                                                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                                                        Arquivo
                                                                                    </label>
                                                                                    <input
                                                                                        type="file"
                                                                                        className="w-full border border-dashed border-blue-300 dark:border-blue-700 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            updateUnitContent(
                                                                                                mIndex,
                                                                                                uIndex,
                                                                                                "file",
                                                                                                e
                                                                                                    .target
                                                                                                    .files?.[0]
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                            {unit
                                                                                .content
                                                                                .type ===
                                                                                "link" && (
                                                                                <div className="space-y-2">
                                                                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                                                        URL
                                                                                    </label>
                                                                                    <InputText
                                                                                        type="url"
                                                                                        className="w-full border border-light-border dark:border-dark-border rounded-lg bg-light-card dark:bg-dark-card px-4 py-2 text-light-foreground dark:text-dark-foreground"
                                                                                        placeholder="https://..."
                                                                                        value={
                                                                                            unit
                                                                                                .content
                                                                                                .url
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            updateUnitContent(
                                                                                                mIndex,
                                                                                                uIndex,
                                                                                                "url",
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                            {unit
                                                                                .content
                                                                                .type ===
                                                                                "text" && (
                                                                                <div className="space-y-2">
                                                                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                                                        Conteúdo
                                                                                    </label>
                                                                                    <InputTextarea
                                                                                        rows={
                                                                                            4
                                                                                        }
                                                                                        className="w-full border border-light-border dark:border-dark-border rounded-lg bg-light-card dark:bg-dark-card px-4 py-2 text-light-foreground dark:text-dark-foreground"
                                                                                        placeholder="Digite o conteúdo da aula..."
                                                                                        value={
                                                                                            unit
                                                                                                .content
                                                                                                .text
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            updateUnitContent(
                                                                                                mIndex,
                                                                                                uIndex,
                                                                                                "text",
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <div className="space-y-2">
                                                                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                                                Selecionar
                                                                                da
                                                                                Biblioteca
                                                                            </label>
                                                                            <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center text-gray-500 dark:text-gray-400">
                                                                                <i className="pi pi-search block text-2xl mb-2"></i>
                                                                                <p className="text-sm">
                                                                                    Busca
                                                                                    na
                                                                                    biblioteca
                                                                                    (em
                                                                                    breve)
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
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
                        </div>

                        <div className="space-y-4 pt-6">
                            <button
                                onClick={addModule}
                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <i className="pi pi-plus"></i>
                                Adicionar módulo
                            </button>
                        </div>

                        {/* Botões de ação */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-light-border dark:border-dark-border mt-8">
                            <Link
                                href={route(
                                    "teacher.courses.settings",
                                    course.id
                                )}
                                className="px-6 py-3 rounded-lg border border-light-border dark:border-dark-border text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2"
                            >
                                <i className="pi pi-arrow-left"></i>
                                Voltar
                            </Link>

                            <PrimaryButton
                                disabled={processing}
                                className="px-8 py-3 rounded-lg flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <i className="pi pi-spin pi-spinner"></i>
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <i className="pi pi-check"></i>
                                        Salvar
                                    </>
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
