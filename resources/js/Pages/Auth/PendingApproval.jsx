import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Hourglass, ShieldAlert } from "lucide-react";

export default function PendingApproval() {
    return (
        <GuestLayout>
            <Head title="Aguardando Aprovação" />

            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full mb-4 shadow-lg">
                    <Hourglass className="h-8 w-8 text-white animate-pulse" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                    Aguardando Aprovação
                </h1>
                <p className="text-gray-200">
                    Sua conta está criada, falta apenas a validação de um
                    administrador.
                </p>
            </div>

            {/* Card */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-8 max-w-xl mx-auto backdrop-blur">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-gray-700 ring-1 ring-gray-600">
                        <ShieldAlert className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="space-y-4 text-sm leading-relaxed">
                        <p className="text-gray-100">
                            Você selecionou um perfil que requer revisão manual
                            (Professor ou Pesquisador). Para garantir a
                            qualidade da plataforma, precisamos confirmar suas
                            informações antes de liberar o acesso completo.
                        </p>
                        <p className="text-gray-200">
                            Assim que aprovado você receberá um email e poderá
                            acessar todas as funcionalidades como criação e
                            gestão de cursos.
                        </p>
                        <p className="text-gray-400">
                            Tempo médio de aprovação: {""}
                            <span className="font-semibold text-gray-100">
                                até 24h úteis
                            </span>
                            .
                        </p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="inline-flex justify-center items-center px-4 py-3 bg-gray-700 rounded-md font-semibold text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                    >
                        Sair
                    </Link>
                    <Link
                        href={route("login")}
                        className="inline-flex justify-center items-center px-4 py-3 bg-yellow-600 rounded-md font-semibold text-sm text-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition"
                    >
                        Recarregar Página
                    </Link>
                </div>

                <div className="mt-6 text-center text-xs text-gray-500">
                    Se acha que isso foi um engano, entre em contato com o
                    suporte.
                </div>
            </div>
        </GuestLayout>
    );
}
