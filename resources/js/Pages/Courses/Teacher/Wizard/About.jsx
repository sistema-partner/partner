import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import ImageUpload from "@/Components/ImageUpload";
import { MultiSelect } from 'primereact/multiselect';
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
        console.log(data)

        post(route("teacher.courses.update", course.id), {
            forceFormData: true,
            _method: 'put',
        });
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Sobre o curso" />

            <div className="max-w-3xl mx-auto py-10">
                <div className=" w-full justify-center text-center mb-6">
                    <h1 className="text-4xl font-bold mb-2">Sobre o curso</h1>
                    <h3 className="text-lg font-medium text-gray-500">Preencha as informações abaixo para criar o curso.</h3>

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
                    <div className="primereact-wrapper border-solid border-gray-500">
                    <MultiSelect
                        value={data?.tags}
                        onChange={(e) => setData('tags', e.value)}
                        options={tags}
                        optionLabel="name"
                        filter
                        filterDelay={400}
                        placeholder="Filtrar tags"
                        maxSelectedLabels={5}
                        className="w-full"
                        pt={{
                            root: {
                                className: 'border border-light-border dark:border-dark-border rounded-lg'
                            }
                        }}
/>
                    </div>

                    <PrimeImageUpload
                        label="Imagem do curso"
                        value={data.image}
                        onChange={(file) => setData("image", file)}
                        error={errors.image}
                    />

                    <div className="flex justify-between">
                        <Link
                            href={route("teacher.courses.index")}
                            className="text-gray-500"
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