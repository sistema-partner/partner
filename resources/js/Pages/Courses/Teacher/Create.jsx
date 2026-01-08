import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import { Card } from "primereact/card";

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

            <div className="max-w-3xl mx-auto py-10">
                {/* Cabeçalho */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                        <i className="pi pi-plus text-3xl text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Novo Curso
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Dê um nome ao seu curso para começar
                    </p>
                </div>

                <Card className="shadow-lg border-0">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel value="Título do curso" />
                            <TextInput
                                className="w-full"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                            />
                            <InputError message={errors.title} />
                        </div>

                        {/* Botões */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-light-border dark:border-dark-border">
                            <Link
                                href={route("dashboard")}
                                className="px-6 py-3 rounded-lg border border-light-border dark:border-dark-border text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2"
                            >
                                <i className="pi pi-arrow-left"></i>
                                Cancelar
                            </Link>

                            <PrimaryButton
                                disabled={processing}
                                className="px-8 py-3 rounded-lg flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <i className="pi pi-spin pi-spinner"></i>
                                        Criando...
                                    </>
                                ) : (
                                    <>
                                        <i className="pi pi-check"></i>
                                        Criar e continuar
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
