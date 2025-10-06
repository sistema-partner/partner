import { Link } from '@inertiajs/react';
import { BookOpen, Clock, CheckCircle, XCircle, UserCheck, BarChart3 } from 'lucide-react';

export default function StudentDashboard({ enrolledCourses, pendingEnrollments }) {
    return (
        <div className="space-y-6">
            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center">
                        <BookOpen className="h-8 w-8 text-green-500 mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Cursos Ativos</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {enrolledCourses.filter(course => course.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <Clock className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Cursos Futuros</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {enrolledCourses.filter(course => course.status === 'planned').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-gray-500">
                    <div className="flex items-center">
                        <CheckCircle className="h-8 w-8 text-gray-500 mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Cursos Concluídos</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {enrolledCourses.filter(course => course.status === 'ended').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-orange-500">
                    <div className="flex items-center">
                        <UserCheck className="h-8 w-8 text-orange-500 mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Matrículas Pendentes</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {pendingEnrollments.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cursos Ativos */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-green-500" />
                        Meus Cursos Ativos
                    </h2>
                </div>
                <div className="p-6">
                    {enrolledCourses.filter(course => course.status === 'active').length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses
                                .filter(course => course.status === 'active')
                                .map(course => (
                                    <CourseCard key={course.id} course={course} type="active" />
                                ))
                            }
                        </div>
                    ) : (
                        <EmptyState 
                            icon={BookOpen}
                            title="Nenhum curso ativo"
                            description="Você não está matriculado em nenhum curso ativo no momento."
                            action={
                                <Link
/*                                     href={route('courses.index')} */
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                >
                                    INSERIR CÓDIGO DE CURSO
                                </Link>
                            }
                        />
                    )}
                </div>
            </div>

            {/* Matrículas Pendentes */}
            {pendingEnrollments.length > 0 && (
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-orange-500" />
                            Matrículas Pendentes de Aprovação
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {pendingEnrollments.map(enrollment => (
                                <div key={enrollment.id} className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{enrollment.course.title}</h3>
                                        <p className="text-sm text-gray-600">Código: {enrollment.course.code}</p>
                                        <p className="text-sm text-orange-600 mt-1">
                                            Aguardando aprovação do professor
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Solicitado em: {new Date(enrollment.requested_at).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Cursos Futuros */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-500" />
                        Cursos Futuros
                    </h2>
                </div>
                <div className="p-6">
                    {enrolledCourses.filter(course => course.status === 'planned').length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses
                                .filter(course => course.status === 'planned')
                                .map(course => (
                                    <CourseCard key={course.id} course={course} type="planned" />
                                ))
                            }
                        </div>
                    ) : (
                        <EmptyState 
                            icon={Clock}
                            title="Nenhum curso futuro"
                            description="Você não está matriculado em nenhum curso que começará em breve."
                        />
                    )}
                </div>
            </div>

            {/* Cursos Concluídos */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-gray-500" />
                        Cursos Concluídos
                    </h2>
                </div>
                <div className="p-6">
                    {enrolledCourses.filter(course => course.status === 'ended').length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses
                                .filter(course => course.status === 'ended')
                                .map(course => (
                                    <CourseCard key={course.id} course={course} type="ended" />
                                ))
                            }
                        </div>
                    ) : (
                        <EmptyState 
                            icon={CheckCircle}
                            title="Nenhum curso concluído"
                            description="Você ainda não concluiu nenhum curso."
                        />
                    )}
                </div>
            </div>

            {/* Métricas de Progresso (Futuro - para o dashboard de metas) */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                        Meu Progresso
                    </h2>
                </div>
                <div className="p-6">
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">
                            Em breve: Dashboard interativo com suas metas de aprendizagem
                        </p>
                        <div className="flex justify-center gap-4 text-sm text-gray-400">
                            <span>📊 Gráficos de desempenho</span>
                            <span>🎯 Metas personalizadas</span>
                            <span>📈 Comparação com a turma</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente de Card de Curso
function CourseCard({ course, type }) {
    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            planned: 'bg-blue-100 text-blue-800',
            ended: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            active: 'Ativo',
            planned: 'Futuro',
            ended: 'Concluído',
            cancelled: 'Cancelado'
        };
        return texts[status] || status;
    };

    const getActionButton = (course, type) => {
        switch (type) {
            case 'active':
                return (
                    <Link
                        href={route('courses.show', { course: course.id })}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700 transition-colors"
                    >
                        Acessar Curso
                    </Link>
                );
            case 'planned':
                return (
                    <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded text-center cursor-not-allowed"
                    >
                        Início em {new Date(course.start_date).toLocaleDateString('pt-BR')}
                    </button>
                );
            case 'ended':
                return (
                    <Link
                        href={route('courses.show', { course: course.id })}
                        className="w-full bg-gray-600 text-white py-2 px-4 rounded text-center hover:bg-gray-700 transition-colors"
                    >
                        Ver Conteúdo
                    </Link>
                );
            default:
                return null;
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {course.image_url && (
                <img 
                    src={course.image_url} 
                    alt={course.title}
                    className="w-full h-40 object-cover"
                />
            )}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                        {course.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                        {getStatusText(course.status)}
                    </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.description}
                </p>
                
                <div className="space-y-2 text-xs text-gray-500 mb-4">
                    <div className="flex justify-between">
                        <span>Código:</span>
                        <span className="font-mono">{course.code}</span>
                    </div>
                    {course.teacher && (
                        <div className="flex justify-between">
                            <span>Professor:</span>
                            <span>{course.teacher.name}</span>
                        </div>
                    )}
                    {course.start_date && (
                        <div className="flex justify-between">
                            <span>Início:</span>
                            <span>{new Date(course.start_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                    )}
                    {course.end_date && (
                        <div className="flex justify-between">
                            <span>Término:</span>
                            <span>{new Date(course.end_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                    )}
                </div>

                {getActionButton(course, type)}
            </div>
        </div>
    );
}

// Componente de Estado Vazio
function EmptyState({ icon: Icon, title, description, action }) {
    return (-
        <div className="text-center py-8">
            <Icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">{description}</p>
            {action && action}
        </div>
    );
}