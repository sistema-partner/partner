import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import ImageUpload from "@/Components/ImageUpload";
import { MultiSelect } from "primereact/multiselect";
import { useState } from "react";
import PrimeImageUpload from "@/Components/PrimeImageUpload";

export default function About({ auth, course, tags }) {
    const { data, setData, post, processing, errors } = useForm({
        title: course.title ?? "",
        description: course.description ?? "",
        image: null,
        tags: course.tags ?? [],
    });

    function submit(e) {
        e.preventDefault();

        // Extrair apenas os IDs das tags
        const tagIds = Array.isArray(data.tags)
            ? data.tags.map((tag) => (typeof tag === "object" ? tag.id : tag))
            : [];

        console.log("Form data being sent:", {
            title: data.title,
            description: data.description,
            image: data.image,
            tags: tagIds,
        });

        post(
            route("teacher.courses.about.update", course.id),
            {
                title: data.title,
                description: data.description,
                image: data.image,
                tags: tagIds,
                _method: "PUT",
            },
            {
                forceFormData: true,
            }
        );
    }

    function handleCancel() {
        // Deletar o curso ao cancelar
        router.delete(route("teacher.courses.destroy", course.id), {
            preserveScroll: true,
            onSuccess: () => {
                router.visit(route("teacher.dashboard"));
            },
        });
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Sobre o curso" />

            <div className="max-w-3xl mx-auto py-10">
                {/* Cabeçalho */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                        <i className="pi pi-info-circle text-3xl text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Sobre
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Defina como os alunos podem acessar este curso
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel value="Título do curso" />
                        <TextInput
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="w-full"
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div>
                        <InputLabel value="Descrição" />
                        <TextInput
                            className="w-full rounded-lg border"
                            rows={5}
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            textarea
                        />
                        <InputError message={errors.description} />
                    </div>
                    <div>
                        <InputLabel value="Tags do curso" />
                        <div className="primereact-wrapper border-solid border-gray-500">
                            <MultiSelect
                                value={data?.tags}
                                onChange={(e) => setData("tags", e.value)}
                                options={tags}
                                optionLabel="name"
                                filter
                                filterDelay={400}
                                placeholder="Selecione as tags do curso"
                                maxSelectedLabels={5}
                                className="w-full"
                                pt={{
                                    root: {
                                        className:
                                            "border border-light-border dark:border-dark-border rounded-lg",
                                    },
                                }}
                            />
                        </div>
                        <InputError message={errors.tags} />
                    </div>

                    <PrimeImageUpload
                        label="Imagem do curso"
                        previewUrl={course.image_url}
                        value={data.image}
                        onChange={(file) => setData("image", file)}
                        error={errors.image}
                    />

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            <i className="pi pi-trash"></i>
                            Cancelar e Deletar
                        </button>

                        <PrimaryButton disabled={processing}>
                            Salvar e continuar
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
