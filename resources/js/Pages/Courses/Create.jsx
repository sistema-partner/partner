import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GlassCard from "@/Components/GlassCard";
import ImageUpload from "@/Components/ImageUpload";
import DateRange from "@/Components/DateRange";
import ContentSelectModal from "@/Components/ContentSelectModal";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        image: null,
        cover: null,
        modules: [], // [{title, description, contents: []}]
    });
    const [showContentModal, setShowContentModal] = useState(false);
    const [activeModuleIndex, setActiveModuleIndex] = useState(null);

    const addModule = () => {
        setData("modules", [
            ...data.modules,
            { title: "", description: "", contents: [] },
        ]);
    };

    const updateModuleField = (index, field, value) => {
        const modules = [...data.modules];
        modules[index][field] = value;
        setData("modules", modules);
    };

    const removeModule = (index) => {
        const modules = [...data.modules];
        modules.splice(index, 1);
        setData("modules", modules);
        // Se o módulo ativo foi removido, fechar modal
        if (activeModuleIndex === index) {
            setShowContentModal(false);
            setActiveModuleIndex(null);
        }
    };

    const confirmRemoveModule = (index) => {
        if (
            window.confirm(
                "Remover este módulo? Esta ação não pode ser desfeita."
            )
        ) {
            removeModule(index);
        }
    };

    const attachContentToModule = (content) => {
        const modules = [...data.modules];
        modules[activeModuleIndex].contents.push(content);
        setData("modules", modules);
    };

    const openContentModal = (index) => {
        setActiveModuleIndex(index);
        setShowContentModal(true);
    };
    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("start_date", data.start_date);
        formData.append("end_date", data.end_date);
        if (data.image) formData.append("image", data.image);
        if (data.cover) formData.append("cover", data.cover);
        // Serializar módulos
        data.modules.forEach((m, mi) => {
            formData.append(`modules[${mi}][title]`, m.title);
            formData.append(`modules[${mi}][description]`, m.description || "");
            m.contents.forEach((c, ci) => {
                formData.append(
                    `modules[${mi}][contents][${ci}][title]`,
                    c.title
                );
                formData.append(
                    `modules[${mi}][contents][${ci}][type]`,
                    c.type
                );
                if (c.is_public)
                    formData.append(
                        `modules[${mi}][contents][${ci}][is_public]`,
                        c.is_public ? 1 : 0
                    );
                if (c.id)
                    formData.append(
                        `modules[${mi}][contents][${ci}][id]`,
                        c.id
                    );
                if (c.file)
                    formData.append(
                        `modules[${mi}][contents][${ci}][file]`,
                        c.file
                    );
                if (c.url)
                    formData.append(
                        `modules[${mi}][contents][${ci}][url]`,
                        c.url
                    );
                if (c.content)
                    formData.append(
                        `modules[${mi}][contents][${ci}][content]`,
                        c.content
                    );
                if (c.description)
                    formData.append(
                        `modules[${mi}][contents][${ci}][description]`,
                        c.description
                    );
            });
        });
        post(route("courses.store"), { data: formData, forceFormData: true });
    };

    return (
        <>
            <AuthenticatedLayout user={auth.user}>
                <Head title="Criar Curso" />

                <div className="py-6">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* Header da página */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Criar Novo Curso
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Defina as informações básicas do curso. Você
                                poderá editar depois.
                            </p>
                        </div>

                        <GlassCard>
                            <form
                                onSubmit={submit}
                                className="space-y-6"
                                encType="multipart/form-data"
                            >
                                {/* Uploads de Imagem */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ImageUpload
                                        label="Imagem do Curso"
                                        name="image"
                                        value={data.image}
                                        onChange={(file) =>
                                            setData("image", file)
                                        }
                                        error={errors.image}
                                        helper="Usada como miniatura nas listagens."
                                    />
                                </div>
                                {/* Título do Curso */}
                                <div className="space-y-1">
                                    <InputLabel
                                        htmlFor="title"
                                        value="Título do Curso"
                                    />
                                    <TextInput
                                        id="title"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        autoComplete="title"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.title}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Descrição */}
                                <div className="space-y-1">
                                    <InputLabel
                                        htmlFor="description"
                                        value="Descrição"
                                    />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="4"
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                    ></textarea>
                                    <InputError
                                        message={errors.description}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Datas */}
                                <DateRange
                                    startValue={data.start_date}
                                    endValue={data.end_date}
                                    onChange={(field, value) =>
                                        setData(field, value)
                                    }
                                    errors={errors}
                                />

                                {/* Módulos do Curso */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                            Módulos
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={addModule}
                                            className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700"
                                        >
                                            Adicionar Módulo
                                        </button>
                                    </div>
                                    {data.modules.length === 0 && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Nenhum módulo adicionado ainda.
                                        </p>
                                    )}
                                    <div className="space-y-4">
                                        {data.modules.map((m, idx) => (
                                            <div
                                                key={idx}
                                                className="relative border border-gray-200 dark:border-gray-700 rounded-md p-4 pt-6 space-y-3 bg-gray-50 dark:bg-gray-700/30 group"
                                            >
                                                {/* Botão deletar módulo */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        confirmRemoveModule(idx)
                                                    }
                                                    aria-label="Remover módulo"
                                                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="w-4 h-4"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                                            Título do Módulo
                                                        </label>
                                                        <input
                                                            value={m.title}
                                                            onChange={(e) =>
                                                                updateModuleField(
                                                                    idx,
                                                                    "title",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="mt-1 w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                                                            placeholder={`Módulo ${
                                                                idx + 1
                                                            }`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                                            Descrição
                                                        </label>
                                                        <input
                                                            value={
                                                                m.description
                                                            }
                                                            onChange={(e) =>
                                                                updateModuleField(
                                                                    idx,
                                                                    "description",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="mt-1 w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                                            Conteúdos
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openContentModal(
                                                                    idx
                                                                )
                                                            }
                                                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                                        >
                                                            Adicionar Conteúdo
                                                        </button>
                                                    </div>
                                                    {m.contents.length === 0 ? (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Nenhum conteúdo
                                                            anexado.
                                                        </p>
                                                    ) : (
                                                        <ul className="space-y-1">
                                                            {m.contents.map(
                                                                (c, i) => (
                                                                    <li
                                                                        key={i}
                                                                        className="text-xs flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-2 py-1"
                                                                    >
                                                                        <span
                                                                            className="truncate max-w-[60%]"
                                                                            title={
                                                                                c.title
                                                                            }
                                                                        >
                                                                            {
                                                                                c.title
                                                                            }
                                                                        </span>
                                                                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] uppercase">
                                                                            {
                                                                                c.type
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Botões de Ação */}
                                <div className="flex items-center justify-end pt-2">
                                    <Link
                                        href={route("dashboard")}
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mr-4 transition-colors"
                                    >
                                        Cancelar
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        Salvar Curso
                                    </PrimaryButton>
                                </div>
                            </form>
                        </GlassCard>
                    </div>
                </div>
            </AuthenticatedLayout>
            <ContentSelectModal
                show={showContentModal}
                onClose={() => setShowContentModal(false)}
                moduleIndex={activeModuleIndex}
                onAttach={attachContentToModule}
            />
        </>
    );
}
