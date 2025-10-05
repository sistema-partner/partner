import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function PendingApproval() {
  const { post } = useForm();

  const logout = (e) => {
    e.preventDefault();
    post(route('logout'));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <Head title="Aguardando Aprovação" />
      <div className="w-full max-w-md bg-white shadow rounded-lg p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">Conta em Análise</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Sua conta de professor/pesquisador foi criada, mas ainda está aguardando aprovação de um administrador.
          Assim que for aprovada você poderá acessar o painel de professor.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Status atual: <span className="font-medium text-yellow-600">Pendente</span></p>
          <p>Você receberá um e-mail quando a aprovação ocorrer (se configurado).</p>
        </div>
        <div className="flex flex-col gap-3">
          <form onSubmit={logout}>
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Sair
            </button>
          </form>
          <Link
            href={route('dashboard')}
            className="text-center text-sm text-blue-600 hover:underline"
          >
            Voltar ao dashboard principal
          </Link>
        </div>
      </div>
    </div>
  );
}
