import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';

export default function TeacherDashboard({ taughtCourses, pendingApprovals, isViewingAsStudent }) {
    if (isViewingAsStudent) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-blue-800 mb-4">
                    Visualização como Aluno Ativa
                </h2>
                <p className="text-blue-700">
                    Você está vendo o dashboard com a visão de um aluno. 
                    Use esta ferramenta para verificar como seus cursos aparecem para os estudantes.
                </p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            {/* Estatísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Total de Cursos</h3>
                    <p className="text-2xl font-bold text-blue-600">{taughtCourses.length}</p>
                </div>
                
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Solicitações Pendentes</h3>
                    <p className="text-2xl font-bold text-orange-600">{pendingApprovals.length}</p>
                </div>
                
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Alunos Ativos</h3>
                    <p className="text-2xl font-bold text-green-600">
                        {taughtCourses.reduce((total, course) => total + course.active_enrollments_count, 0)}
                    </p>
                </div>
            </div>
            
            {/* Lista de cursos */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Meus Cursos</h2>
                    <div className="space-y-4">
                        {taughtCourses.map(course => (
                            <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-lg">{course.title}</h3>
                                <p className="text-gray-600">{course.description}</p>
                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                    <span>Alunos: {course.active_enrollments_count}</span>
                                    <span>Status: {course.status}</span>
                                </div>
                                 <div className="flex items-center justify-end gap-2">
                                    <Link href={route('courses.show', course.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                        Ver
                                    </Link>
                                    <Link href={route('courses.edit', course.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                        Editar
                                    </Link>
                                    <Link
                                        href={route('courses.destroy', course.id)}
                                        method="delete"
                                        as="button"
                                        className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400"
                                        onBefore={() => confirm('Tem certeza que deseja excluir este curso?')}
                                    >
                                        Excluir
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}