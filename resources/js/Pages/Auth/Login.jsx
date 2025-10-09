import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Users } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Entrar - Partner" />

            {/* Header do Card */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                    <Users className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Bem-vindo de volta
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Entre com suas credenciais para continuar
                </p>
            </div>

            {/* Card do Formulário */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8">
                {status && (
                    <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg text-sm">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel 
                            htmlFor="email" 
                            value="Email" 
                            className="text-gray-700 dark:text-gray-300 font-medium"
                        />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="seu@email.com"
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel 
                            htmlFor="password" 
                            value="Senha" 
                            className="text-gray-700 dark:text-gray-300 font-medium"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                            />
                            <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                                Lembrar de mim
                            </span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline"
                            >
                                Esqueceu sua senha?
                            </Link>
                        )}
                    </div>

                    <PrimaryButton 
                        className="w-full justify-center py-3 text-base font-medium"
                        disabled={processing}
                    >
                        {processing ? 'Entrando...' : 'Entrar'}
                    </PrimaryButton>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Não tem uma conta?{' '}
                        <Link
                            href={route('register')}
                            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline"
                        >
                            Registre-se aqui
                        </Link>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}