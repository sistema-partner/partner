import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
    });

    function submit(e) {
        e.preventDefault();
        post(route("teacher.courses.store"));
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Criar Curso" />

            <div className="max-w-2xl mx-auto py-10">
                <h1 className="text-2xl font-bold mb-2">
                    Criar novo curso
                </h1>

                <p className="text-gray-600 mb-6">
                    Dê um nome ao seu curso para começar.
                </p>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel value="Título do curso" />
                        <TextInput
                            className="w-full"
                            value={data.title}
                            onChange={e => setData("title", e.target.value)}
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="flex justify-between">
                        <Link
                            href={route("teacher.courses.index")}
                            className="text-gray-600"
                        >
                            Cancelar
                        </Link>

                        <PrimaryButton disabled={processing}>
                            Criar e continuar
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
