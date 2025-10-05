import { Head, Link, usePage } from '@inertiajs/react';
import { GraduationCap, BookOpen, Users, Award, Target, TrendingUp, Eye, BarChart3 } from 'lucide-react';

export default function Welcome({ auth }) {
    const { props } = usePage();
    const { user } = auth;

    return (
        <>
            <Head title="Partner - Plataforma Educacional Inteligente" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
                {/* Header */}
                <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-2">
                                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    Partner
                                </span>
                            </div>
                            <nav className="flex gap-3">
                                {user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            Entrar
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            Registrar
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Eye className="h-4 w-4" />
                            Múltiplas Perspectivas em Uma Só Plataforma
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Seu Parceiro Inteligente na 
                            <span className="text-blue-600 dark:text-blue-400"> Jornada Educacional</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                            Uma plataforma integrada que oferece visões personalizadas para estudantes, 
                            professores e pesquisadores. Acompanhe métricas, receba recomendações 
                            e tome decisões baseadas em dados reais.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href={route('register')}
                                className="inline-flex items-center px-8 py-4 bg-blue-600 border border-transparent rounded-md font-semibold text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 text-lg"
                            >
                                Começar Agora
                            </Link>
                            <Link
                                href={route('login')}
                                className="inline-flex items-center px-8 py-4 bg-white border border-gray-300 rounded-md font-semibold text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 text-lg"
                            >
                                Fazer Login
                            </Link>
                        </div>
                    </div>

                    {/* Platform Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                                <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Para Estudantes
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Acompanhe seu progresso, receba recomendações personalizadas e visualize suas metas de aprendizagem de forma clara e motivadora.
                            </p>
                            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                <li>• Metas de aprendizagem personalizadas</li>
                                <li>• Comparação com desempenho da turma</li>
                                <li>• Recomendações inteligentes de conteúdo</li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                                <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Para Professores
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Tenha insights poderosos sobre o andamento das turmas, identifique alunos com dificuldades e tome decisões pedagógicas baseadas em dados.
                            </p>
                            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                <li>• Dashboard analítico das turmas</li>
                                <li>• Acompanhamento de frequência e engajamento</li>
                                <li>• Ferramentas de intervenção pedagógica</li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Para Pesquisadores
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Acesse dados educacionais para suas pesquisas, crie grupos de estudo e colabore em projetos acadêmicos com ferramentas especializadas.
                            </p>
                            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                <li>• Coleta de dados para pesquisa</li>
                                <li>• Análise de métricas educacionais</li>
                                <li>• Ferramentas de colaboração acadêmica</li>
                            </ul>
                        </div>
                    </div>

                    {/* Unique Feature - Multi Perspective */}
                    <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                        <div className="text-center max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Eye className="h-4 w-4" />
                                Funcionalidade Exclusiva
                            </div>
                            <h2 className="text-3xl font-bold mb-4">
                                Múltiplas Perspectivas, Uma Só Conta
                            </h2>
                            <p className="text-blue-100 text-lg mb-6">
                                Se você é estudante, professor e pesquisador, não precisa de contas separadas. 
                                Alterne entre as visões específicas de cada papel através de um simples seletor no header.
                            </p>
                            <div className="flex justify-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                    <span>Visão do Estudante</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                    <span>Visão do Professor</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                    <span>Visão do Pesquisador</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}