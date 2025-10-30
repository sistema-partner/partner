import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import ImageUpload from "@/Components/ImageUpload";
import DateRange from "@/Components/DateRange";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Edit({ auth, course }) {
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0];
    };

    const { data, setData, put, processing, errors } = useForm({
        title: course.title || "",
        code: course.code || "",
        description: course.description || "",
        start_date: formatDate(course.start_date),
        end_date: formatDate(course.end_date),
        status: course.status || "",
        image: course.image_url || null,
        cover: course.cover_url || null,
        remove_image: false,
        remove_cover: false,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("courses.update", course.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Editar Curso" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Editar Curso: {course.title}
                    </h1>
                    <div className="bg-card p-6 shadow-sm sm:rounded-lg">
                        <form
                            onSubmit={submit}
                            encType="multipart/form-data"
                            className="space-y-6"
                        >
                            {/* Uploads */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <ImageUpload
                                        label="Imagem do Curso"
                                        name="image"
                                        value={data.image}
                                        onChange={(file) => {
                                            setData("image", file);
                                            setData("remove_image", false);
                                        }}
                                        error={errors.image}
                                        helper="Miniatura usada em listagens."
                                    />
                                    {data.image &&
                                        !(data.image instanceof File) && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData(
                                                        "remove_image",
                                                        true
                                                    );
                                                    setData("image", null);
                                                }}
                                                className="text-xs text-red-600 hover:text-red-700"
                                            >
                                                Remover imagem atual
                                            </button>
                                        )}
                                </div>
                                <div className="space-y-2">
                                    <ImageUpload
                                        label="Imagem de Capa"
                                        name="cover"
                                        value={data.cover}
                                        onChange={(file) => {
                                            setData("cover", file);
                                            setData("remove_cover", false);
                                        }}
                                        error={errors.cover}
                                        helper="Exibida como banner da página."
                                    />
                                    {data.cover &&
                                        !(data.cover instanceof File) && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData(
                                                        "remove_cover",
                                                        true
                                                    );
                                                    setData("cover", null);
                                                }}
                                                className="text-xs text-red-600 hover:text-red-700"
                                            >
                                                Remover capa atual
                                            </button>
                                        )}
                                </div>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="title"
                                    value="Título do Curso"
                                />
                                <TextInput
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="code"
                                    value="Código do Curso"
                                />
                                <TextInput
                                    id="code"
                                    value={data.code}
                                    className="mt-1 block w-full bg-muted/50"
                                    readOnly
                                />
                                <InputError message={errors.code} />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="description"
                                    value="Descrição"
                                />
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    className="mt-1 block w-full border-border bg-background rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows="4"
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                ></textarea>
                                <InputError message={errors.description} />
                            </div>

                            <DateRange
                                startValue={data.start_date}
                                endValue={data.end_date}
                                onChange={(field, value) =>
                                    setData(field, value)
                                }
                                errors={errors}
                            />

                            <div className="mt-4">
                                <InputLabel htmlFor="status" value="Status" />
                                <select
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    className="mt-1 block w-full border-border bg-background rounded-md shadow-sm"
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                >
                                    <option value="planned">Planejado</option>
                                    <option value="active">Ativo</option>
                                    <option value="cancelled">Cancelado</option>
                                    <option value="ended">Finalizado</option>
                                </select>
                                <InputError message={errors.status} />
                            </div>

                            <div className="flex items-center justify-end mt-6">
                                <Link
                                    href={route("dashboard")}
                                    className="text-sm text-muted-foreground hover:text-foreground mr-4"
                                >
                                    Cancelar
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    Atualizar Curso
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
