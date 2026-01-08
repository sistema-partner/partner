import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimeImageUpload from "@/Components/PrimeImageUpload"; // Altere aqui
import { MultiSelect } from 'primereact/multiselect';

export default function About({ auth, course, tags }) {
    const { data, setData, post, processing, errors } = useForm({
        title: course.title ?? "",
        description: course.description ?? "",
        image: null,
        tags: course.tags ?? [],
    });

    function submit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('tags', JSON.stringify(data.tags));
        
        // Se houver imagem, adiciona ao FormData
        if (data.image instanceof File) {
            formData.append('image', data.image);
        }

        post(route("teacher.courses.update", course.id), {
            data: formData,
            forceFormData: true,
        });
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Sobre o curso" />

            <div className="max-w-3xl mx-auto py-10">
                <h1 className="text-2xl font-bold mb-6">Sobre o curso</h1>

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
                            className="w-full"
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
                        <InputLabel value="Tags" />
                        <MultiSelect
                            value={data.tags}
                            onChange={(e) => setData('tags', e.value)}
                            options={tags}
                            optionLabel="name"
                            filter
                            filterDelay={400}
                            placeholder="Selecione as tags"
                            maxSelectedLabels={5}
                            className="w-full"
                            pt={{
                                root: {
                                    className: 'border border-light-border dark:border-dark-border rounded-lg bg-light-card dark:bg-dark-card'
                                },
                                token: {
                                    className: 'bg-light-primary text-light-primary-foreground rounded px-2 py-1 mr-1 mb-1'
                                }
                            }}
                        />
                        <InputError message={errors.tags} />
                    </div>

                    <PrimeImageUpload
                        label="Imagem do curso"
                        value={data.image}
                        onChange={(file) => setData("image", file)}
                        error={errors.image}
                        maxFileSize={5000000} // 5MB
                    />

                    <div className="flex justify-between">
                        <Link
                            href={route("teacher.courses.index")}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                        >
                            Cancelar
                        </Link>

                        <PrimaryButton disabled={processing}>
                            Salvar e continuar
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}