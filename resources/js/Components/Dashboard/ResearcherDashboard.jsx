import { Link } from '@inertiajs/react';
import { Microscope, BarChart3, Users, Download, FileText, Filter } from 'lucide-react';

export default function ResearcherDashboard({ researchGroups, analytics }) {
    return (
        <div className="space-y-6">
            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center">
                        <Users className="h-8 w-8 text-purple-500 mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Grupos de Pesquisa</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {researchGroups?.length || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <BarChart3 className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Análises Realizadas</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics?.analysis_count || 12}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center">
                        <Download className="h-8 w-8 text-green-500 mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Datasets</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics?.datasets_count || 5}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ferramentas de Pesquisa */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <Microscope className="h-5 w-5 mr-2 text-purple-500" />
                        Ferramentas de Pesquisa
                    </h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ResearchToolCard
                            icon={BarChart3}
                            title="Análise de Dados"
                            description="Acesse dados anonimizados de desempenho dos estudantes para suas pesquisas"
                            actionText="Acessar Analytics"
                            href="/research/analytics"
                            color="purple"
                        />
                        
                        <ResearchToolCard
                            icon={Users}
                            title="Grupos de Estudo"
                            description="Crie e gerencie grupos de estudo para coleta de dados"
                            actionText="Gerenciar Grupos"
                            href="/research/groups"
                            color="blue"
                        />
                        
                        <ResearchToolCard
                            icon={Download}
                            title="Exportar Dados"
                            description="Exporte datasets para análise em ferramentas externas"
                            actionText="Exportar Dados"
                            href="/research/export"
                            color="green"
                        />
                        
                        <ResearchToolCard
                            icon={FileText}
                            title="Relatórios"
                            description="Gere relatórios automáticos da sua pesquisa"
                            actionText="Criar Relatório"
                            href="/research/reports"
                            color="orange"
                        />
                        
                        <ResearchToolCard
                            icon={Filter}
                            title="Filtros Avançados"
                            description="Filtre dados por período, curso, desempenho e mais"
                            actionText="Aplicar Filtros"
                            href="/research/filters"
                            color="red"
                        />
                    </div>
                </div>
            </div>

            {/* Grupos de Pesquisa Ativos */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-blue-500" />
                        Meus Grupos de Pesquisa
                    </h2>
                </div>
                <div className="p-6">
                    {researchGroups && researchGroups.length > 0 ? (
                        <div className="space-y-4">
                            {researchGroups.map(group => (
                                <ResearchGroupCard key={group.id} group={group} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState 
                            icon={Users}
                            title="Nenhum grupo de pesquisa ativo"
                            description="Comece criando seu primeiro grupo de pesquisa para coletar dados."
                            action={
                                <Link
                                    href="/research/groups/create"
                                    className="inline-flex items-center px-4 py-2 bg-purple-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700"
                                >
                                    Criar Grupo
                                </Link>
                            }
                        />
                    )}
                </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Ações Rápidas
                    </h2>
                </div>
                <div className="p-6">
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/research/request-data"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Solicitar Dados
                        </Link>
                        
                        <Link
                            href="/research/analytics/new"
                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                        >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Nova Análise
                        </Link>
                        
                        <Link
                            href="/research/ethics"
                            className="inline-flex items-center px-4 py-2 bg-orange-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-700"
                        >
                            <Microscope className="h-4 w-4 mr-2" />
                            Ética em Pesquisa
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mensagem de Desenvolvimento Futuro */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-start">
                    <Microscope className="h-6 w-6 text-purple-500 mr-3 mt-1" />
                    <div>
                        <h3 className="text-lg font-semibold text-purple-800 mb-2">
                            Dashboard de Pesquisa em Desenvolvimento
                        </h3>
                        <p className="text-purple-700">
                            Esta área está sendo desenvolvida como parte do projeto de pesquisa. 
                            Em breve teremos ferramentas completas para análise de dados educacionais, 
                            métricas de aprendizagem e relatórios acadêmicos.
                        </p>
                        <div className="mt-3 flex gap-4 text-sm text-purple-600">
                            <span>📊 Análises avançadas</span>
                            <span>🔍 Filtros complexos</span>
                            <span>📈 Visualizações customizadas</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente de Card de Ferramenta
function ResearchToolCard({ icon: Icon, title, description, actionText, href, color = 'purple' }) {
    const colorClasses = {
        purple: 'bg-purple-100 text-purple-600',
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        orange: 'bg-orange-100 text-orange-600',
        red: 'bg-red-100 text-red-600'
    };

    return (
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colorClasses[color]} mb-4`}>
                <Icon className="h-6 w-6" />
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-4">{description}</p>
            
            <Link
                href={href}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
                {actionText}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </Link>
        </div>
    );
}

// Componente de Card de Grupo de Pesquisa
function ResearchGroupCard({ group }) {
    return (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-600">{group.description}</p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                        <span>Participantes: {group.participants_count}</span>
                        <span>Status: {group.status}</span>
                        {group.created_at && (
                            <span>Criado em: {new Date(group.created_at).toLocaleDateString('pt-BR')}</span>
                        )}
                    </div>
                </div>
            </div>
            
            <Link
                href={`/research/groups/${group.id}`}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Gerenciar
            </Link>
        </div>
    );
}

// Componente de Estado Vazio
function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="text-center py-8">
            <Icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">{description}</p>
            {action && action}
        </div>
    );
}