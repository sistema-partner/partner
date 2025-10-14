import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GlassCard from '@/Components/GlassCard';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth }) {
     const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
    });
    const submit = (e) => {
        e.preventDefault();
        post(route('courses.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Criar Curso" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header da página */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criar Novo Curso</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Defina as informações básicas do curso. Você poderá editar depois.</p>
                    </div>

                    <GlassCard>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Título do Curso */}
                            <div className="space-y-1">
                                <InputLabel htmlFor="title" value="Título do Curso" />
                                <TextInput
                                    id="title"
                                    name="title"
                                    value={data.title}
                                    className="mt-1 block w-full"
                                    autoComplete="title"
                                    isFocused={true}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            {/* Descrição */}
                            <div className="space-y-1">
                                <InputLabel htmlFor="description" value="Descrição" />
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows="4"
                                    onChange={(e) => setData('description', e.target.value)}
                                ></textarea>
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Datas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="start_date" value="Data de Início" />
                                    <TextInput
                                        id="start_date"
                                        type="date"
                                        name="start_date"
                                        value={data.start_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.start_date} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="end_date" value="Data de Fim" />
                                    <TextInput
                                        id="end_date"
                                        type="date"
                                        name="end_date"
                                        value={data.end_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.end_date} className="mt-2" />
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div className="flex items-center justify-end pt-2">
                                <Link href={route('dashboard')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mr-4 transition-colors">
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
    );
}