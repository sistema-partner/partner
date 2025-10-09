import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registrar - Partner" />

            {/* Header do Card */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                    <UserPlus className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Crie sua conta
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Junte-se à nossa plataforma educacional
                </p>
            </div>

            {/* Card do Formulário */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="name" value="Nome completo" className="text-gray-700 dark:text-gray-300 font-medium" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" className="text-gray-700 dark:text-gray-300 font-medium" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Senha" className="text-gray-700 dark:text-gray-300 font-medium" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirmar senha" className="text-gray-700 dark:text-gray-300 font-medium" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="role" value="Eu sou..." className="text-gray-700 dark:text-gray-300 font-medium" />
                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="student">Estudante</option>
                            <option value="teacher">Professor</option>
                            <option value="researcher">Pesquisador</option>
                        </select>
                        <InputError message={errors.role} className="mt-2" />
                    </div>

                    <PrimaryButton 
                        className="w-full justify-center py-3 text-base font-medium"
                        disabled={processing}
                    >
                        {processing ? 'Registrando...' : 'Criar conta'}
                    </PrimaryButton>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Já tem uma conta?{' '}
                        <Link
                            href={route('login')}
                            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline"
                        >
                            Fazer login
                        </Link>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}