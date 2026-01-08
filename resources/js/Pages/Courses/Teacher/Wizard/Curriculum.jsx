import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BookOpen, Play, FileQuestion, Code2, Trash2, ChevronUp, ChevronDown, Plus, CloudUpload } from "lucide-react";

export default function Curriculum({ auth, course }) {
    // Normalizar dados
    const normalizedModules =
        course.modules && course.modules.length > 0
            ? course.modules.map((module, index) => ({
                  ...module,
                  order: module.order || index,
                  units: (module.units || []).map((unit, idx) => ({
                      ...unit,
                      order: unit.order || idx,
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
        modules: normalizedModules.sort((a, b) => a.order - b.order),
    });

    // Estados para controles visuais
    const [expandedModules, setExpandedModules] = useState({});
    const [expandedUnits, setExpandedUnits] = useState({});

    function submit(e) {
        e.preventDefault();
        post(route("teacher.courses.curriculum.update", course.id), {
            _method: "PATCH",
        });
    }

    // Toggle para expandir/contrair módulos
    const toggleModule = (moduleIndex) => {
        setExpandedModules((prev) => ({
            ...prev,
            [moduleIndex]: !prev[moduleIndex],
        }));
    };

    // Toggle para expandir/contrair unidades
    const toggleUnit = (moduleIndex, unitIndex) => {
        setExpandedUnits((prev) => ({
            ...prev,
            [`${moduleIndex}-${unitIndex}`]:
                !prev[`${moduleIndex}-${unitIndex}`],
        }));
    };

    // ---- MODULES ----
    function addModule() {
        const newModule = {
            id: null,
            title: "Novo Módulo",
            description: "",
            order: data.modules.length,
            units: [],
        };

        setData("modules", [...data.modules, newModule]);
        setExpandedModules((prev) => ({
            ...prev,
            [data.modules.length]: true,
        }));
    }

    function updateModule(index, field, value) {
        const modules = [...data.modules];
        modules[index][field] = value;
        setData("modules", modules);
    }

    function removeModule(index) {
        if (!confirm("Tem certeza que deseja remover este módulo?")) return;

        const modules = [...data.modules];
        modules.splice(index, 1);
        // Reordenar os módulos restantes
        modules.forEach((mod, idx) => (mod.order = idx));
        setData("modules", modules);

        // Remover estado expandido
        const newExpanded = { ...expandedModules };
        delete newExpanded[index];
        setExpandedModules(newExpanded);
    }

    // ---- UNITS ----
    function addUnit(moduleIndex) {
        const modules = [...data.modules];
        const module = modules[moduleIndex];

        module.units.push({
            id: null,
            title: "Nova Aula",
            type: "lesson",
            order: module.units.length,
            is_optional: false,
            duration: "10 min",
            content: {
                source: "upload",
                type: "video",
                file: null,
                libraryContent: null,
                url: "",
                text: "",
            },
        });

        setData("modules", modules);
        setExpandedUnits((prev) => ({
            ...prev,
            [`${moduleIndex}-${module.units.length - 1}`]: true,
        }));
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
        if (!confirm("Tem certeza que deseja remover esta unidade?")) return;

        const modules = [...data.modules];
        modules[mIndex].units.splice(uIndex, 1);
        // Reordenar unidades
        modules[mIndex].units.forEach((unit, idx) => (unit.order = idx));
        setData("modules", modules);

        // Remover estado expandido
        const newExpanded = { ...expandedUnits };
        delete newExpanded[`${mIndex}-${uIndex}`];
        setExpandedUnits(newExpanded);
    }

    // Função para mover módulos
    const reorderModules = (sourceIndex, destinationIndex) => {
        const modules = Array.from(data.modules);
        const [removed] = modules.splice(sourceIndex, 1);
        modules.splice(destinationIndex, 0, removed);

        // Atualizar ordens
        modules.forEach((module, index) => {
            module.order = index;
        });

        setData("modules", modules);
    };

    // Função para mover unidades
    const reorderUnits = (moduleIndex, sourceIndex, destinationIndex) => {
        const modules = [...data.modules];
        const units = Array.from(modules[moduleIndex].units);
        const [removed] = units.splice(sourceIndex, 1);
        units.splice(destinationIndex, 0, removed);

        // Atualizar ordens
        units.forEach((unit, index) => {
            unit.order = index;
        });

        modules[moduleIndex].units = units;
        setData("modules", modules);
    };

    // Ícones por tipo de unidade
    const getUnitIcon = (type) => {
        switch (type) {
            case "quiz":
                return <FileQuestion className="w-4 h-4" />;
            case "project":
                return <BookOpen className="w-4 h-4" />;
            case "code_exercise":
                return <Code2 className="w-4 h-4" />;
            default:
                return <Play className="w-4 h-4" />;
        }
    };

    // Cor por tipo de unidade
    const getUnitColor = (type) => {
        switch (type) {
            case "quiz":
                return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
            case "project":
                return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
            case "code_exercise":
                return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
            default:
                return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Currículo do curso" />

            <div className="max-w-6xl mx-auto py-8 px-4">
                {/* Cabeçalho */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Currículo do Curso
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Organize os módulos e aulas do seu curso
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={route(
                                    "teacher.courses.settings",
                                    course.id
                                )}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                Voltar
                            </Link>
                            <PrimaryButton
                                onClick={submit}
                                disabled={processing}
                                className="px-6 py-2"
                            >
                                {processing
                                    ? "Salvando..."
                                    : "Salvar Currículo"}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Módulos
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data.modules.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Play className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Aulas
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data.modules.reduce(
                                        (acc, mod) => acc + mod.units.length,
                                        0
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <FileQuestion className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Quizzes
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data.modules.reduce(
                                        (acc, mod) =>
                                            acc +
                                            mod.units.filter(
                                                (u) => u.type === "quiz"
                                            ).length,
                                        0
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                <Code2 className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Exercícios
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data.modules.reduce(
                                        (acc, mod) =>
                                            acc +
                                            mod.units.filter(
                                                (u) =>
                                                    u.type === "code_exercise"
                                            ).length,
                                        0
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Módulos */}
                <div className="space-y-4">
                    {data.modules.map((module, mIndex) => (
                        <div
                            key={mIndex}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            {/* Cabeçalho do Módulo */}
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <button
                                            onClick={() => toggleModule(mIndex)}
                                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <i
                                                className={`pi pi-chevron-${
                                                    expandedModules[mIndex]
                                                        ? "up"
                                                        : "down"
                                                }`}
                                            ></i>
                                        </button>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={module.title}
                                                onChange={(e) =>
                                                    updateModule(
                                                        mIndex,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white"
                                                placeholder="Nome do módulo"
                                            />
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-400">
                                            {module.units.length} aulas
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => removeModule(mIndex)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Remover módulo"
                                        >
                                            <i className="pi pi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                {expandedModules[mIndex] && (
                                    <div className="mt-3 ml-11">
                                        <textarea
                                            value={module.description || ""}
                                            onChange={(e) =>
                                                updateModule(
                                                    mIndex,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Descrição do módulo (opcional)"
                                            rows="2"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Conteúdo do Módulo (expandido) */}
                            {expandedModules[mIndex] && (
                                <div className="p-4">
                                    {/* Unidades do módulo */}
                                    <div className="space-y-3">
                                        {module.units.map((unit, uIndex) => (
                                            <div
                                                key={uIndex}
                                                className="bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600"
                                            >
                                                <div className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${getUnitColor(
                                                                unit.type
                                                            )}`}
                                                        >
                                                            <span className="text-sm">
                                                                {getUnitIcon(
                                                                    unit.type
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
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
                                                                className="w-full font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white"
                                                                placeholder="Título da unidade"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                {unit.duration ||
                                                                    "10 min"}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    toggleUnit(
                                                                        mIndex,
                                                                        uIndex
                                                                    )
                                                                }
                                                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                                            >
                                                                <i
                                                                    className={`pi pi-chevron-${
                                                                        expandedUnits[
                                                                            `${mIndex}-${uIndex}`
                                                                        ]
                                                                            ? "up"
                                                                            : "down"
                                                                    }`}
                                                                ></i>
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    removeUnit(
                                                                        mIndex,
                                                                        uIndex
                                                                    )
                                                                }
                                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                                title="Remover unidade"
                                                            >
                                                                <i className="pi pi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Conteúdo expandido da unidade */}
                                                    {expandedUnits[
                                                        `${mIndex}-${uIndex}`
                                                    ] && (
                                                        <div className="mt-4 pl-11 space-y-4">
                                                            {/* Tipo de unidade */}
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-32">
                                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                        Tipo
                                                                    </label>
                                                                    <select
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
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                                                                    >
                                                                        <option value="lesson">
                                                                            Aula
                                                                        </option>
                                                                        <option value="quiz">
                                                                            Quiz
                                                                        </option>
                                                                        <option value="project">
                                                                            Projeto
                                                                        </option>
                                                                        <option value="code_exercise">
                                                                            Exercício
                                                                        </option>
                                                                    </select>
                                                                </div>

                                                                {/* Duração */}
                                                                <div className="w-32">
                                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                        Duração
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={
                                                                            unit.duration ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateUnit(
                                                                                mIndex,
                                                                                uIndex,
                                                                                "duration",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                                                                        placeholder="ex: 15 min"
                                                                    />
                                                                </div>

                                                                {/* Opcional */}
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`optional-${mIndex}-${uIndex}`}
                                                                        checked={
                                                                            unit.is_optional ||
                                                                            false
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateUnit(
                                                                                mIndex,
                                                                                uIndex,
                                                                                "is_optional",
                                                                                e
                                                                                    .target
                                                                                    .checked
                                                                            )
                                                                        }
                                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                    />
                                                                    <label
                                                                        htmlFor={`optional-${mIndex}-${uIndex}`}
                                                                        className="text-sm text-gray-700 dark:text-gray-300"
                                                                    >
                                                                        Opcional
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            {/* Conteúdo da aula (apenas para lessons) */}
                                                            {unit.type ===
                                                                "lesson" && (
                                                                <div className="space-y-4">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                Tipo
                                                                                de
                                                                                Conteúdo
                                                                            </label>
                                                                            <select
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
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                                                                            >
                                                                                <option value="video">
                                                                                    Vídeo
                                                                                </option>
                                                                                <option value="pdf">
                                                                                    PDF
                                                                                </option>
                                                                                <option value="document">
                                                                                    Documento
                                                                                </option>
                                                                                <option value="link">
                                                                                    Link
                                                                                </option>
                                                                                <option value="text">
                                                                                    Texto
                                                                                </option>
                                                                            </select>
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                Fonte
                                                                            </label>
                                                                            <select
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
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                                                                            >
                                                                                <option value="upload">
                                                                                    Upload
                                                                                </option>
                                                                                <option value="library">
                                                                                    Biblioteca
                                                                                </option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    {/* Campos específicos por tipo */}
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
                                                                                <div>
                                                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                        Arquivo
                                                                                    </label>
                                                                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center relative overflow-hidden">
                                                                                        <div className="mb-2">
                                                                                            <i className="pi pi-cloud-upload text-2xl text-gray-400"></i>
                                                                                        </div>
                                                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                                                            Arraste
                                                                                            ou
                                                                                            clique
                                                                                            para
                                                                                            fazer
                                                                                            upload
                                                                                        </p>
                                                                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                                                                            MP4,
                                                                                            PDF,
                                                                                            DOCX
                                                                                            •
                                                                                            Máx.
                                                                                            100MB
                                                                                        </p>
                                                                                        <input
                                                                                            type="file"
                                                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                                            style={{
                                                                                                position:
                                                                                                    "absolute",
                                                                                                top: 0,
                                                                                                left: 0,
                                                                                                width: "100%",
                                                                                                height: "100%",
                                                                                            }}
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
                                                                                </div>
                                                                            )}{" "}
                                                                            {unit
                                                                                .content
                                                                                .type ===
                                                                                "link" && (
                                                                                <div>
                                                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                        URL
                                                                                    </label>
                                                                                    <input
                                                                                        type="url"
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
                                                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                                                                                        placeholder="https://..."
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                            {unit
                                                                                .content
                                                                                .type ===
                                                                                "text" && (
                                                                                <div>
                                                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                        Conteúdo
                                                                                    </label>
                                                                                    <textarea
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
                                                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                                                                                        rows="4"
                                                                                        placeholder="Digite o conteúdo da aula..."
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                                                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                                                                Em
                                                                                breve:
                                                                                selecione
                                                                                conteúdo
                                                                                da
                                                                                biblioteca
                                                                                da
                                                                                plataforma
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Botão para adicionar unidade */}
                                    <button
                                        onClick={() => addUnit(mIndex)}
                                        className="mt-4 w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <i className="pi pi-plus"></i>
                                        Adicionar conteúdo ao módulo
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Botão para adicionar novo módulo */}
                    <button
                        onClick={addModule}
                        className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex flex-col items-center justify-center gap-2"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <i className="pi pi-plus text-xl"></i>
                        </div>
                        <span className="font-medium">
                            Adicionar novo módulo
                        </span>
                        <span className="text-sm">
                            Clique para criar um novo módulo de aprendizado
                        </span>
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
