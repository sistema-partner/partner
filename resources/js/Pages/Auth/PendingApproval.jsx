import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function PendingApproval() {
    return (
        <GuestLayout>
            <Head title="Aguardando Aprovação" />

            <div className="text-center">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                    <h2 className="text-lg font-semibold">Aguardando Aprovação</h2>
                </div>
                
                <p className="text-gray-600 mb-4">
                    Sua conta foi criada com sucesso, mas precisa ser aprovada por um administrador.
                </p>
                
                <p className="text-gray-500 text-sm mb-6">
                    Você receberá um email quando sua conta for aprovada.
                </p>

                <div className="flex justify-center gap-4">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Sair
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}