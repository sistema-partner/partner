import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import GlassCard from '@/Components/GlassCard';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout

        >
            <Head title="Meu Perfil" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header da página */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Atualize suas informações, senha e preferências da conta.</p>
                    </div>

                    {/* Cards */}
                    <div className="space-y-6">
                        <GlassCard>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </GlassCard>

                        <GlassCard>
                            <UpdatePasswordForm className="max-w-xl" />
                        </GlassCard>

                        <GlassCard>
                            <DeleteUserForm className="max-w-xl" />
                        </GlassCard>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
