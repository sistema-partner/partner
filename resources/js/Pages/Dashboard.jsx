import { Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StudentDashboard from '@/Components/Dashboard/StudentDashboard';
import TeacherDashboard from '@/Components/Dashboard/TeacherDashboard';
import ResearcherDashboard from '@/Components/Dashboard/ResearcherDashboard';
import AdminDashboard from '@/Components/Dashboard/AdminDashboard';

export default function Dashboard() {
    const { props } = usePage();
    const { user, enrolled_courses, pending_enrollments, taught_courses, pending_approvals, research_groups, analytics, pending_approvals_count, total_users, recent_users } = props;
    
    const renderDashboardContent = () => {
        const effectiveRole = user.role;
        
        switch (effectiveRole) {
            case 'student':
                return (
                    <StudentDashboard 
                        enrolledCourses={enrolled_courses || []}
                        pendingEnrollments={pending_enrollments || []}
                    />
                );
                
            case 'teacher':
                return (
                    <TeacherDashboard 
                        taughtCourses={taught_courses || []}
                        pendingApprovals={pending_approvals || []}
                        isViewingAsStudent={user.is_viewing_as_student}
                    />
                );
                
            case 'researcher':
                return (
                    <ResearcherDashboard 
                        researchGroups={research_groups || []}
                        analytics={analytics || {}}
                    />
                );
                
            case 'admin':
                return (
                    <AdminDashboard 
                        pendingApprovalsCount={pending_approvals_count || 0}
                        totalUsers={total_users || 0}
                        recentUsers={recent_users || []}
                    />
                );
                
            default:
                return <div>Role não reconhecida</div>;
        }
    };
    console.log(user)
    
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header do Dashboard */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Dashboard - {getRoleLabel(user.role)}
                                </h1>
                                {user.is_viewing_as_student && (
                                    <div className="flex items-center gap-2 mt-2 p-3 bg-yellow-100 border border-yellow-400 rounded-md">
                                        <span className="text-yellow-700 text-sm">
                                            🎭 Modo de visualização: Você está vendo o dashboard como aluno
                                        </span>
                                        <Link
                                            href={route('view-normal')}
                                            method="post"
                                            as="button"
                                            className="text-sm text-yellow-700 underline hover:text-yellow-800"
                                        >
                                            Voltar à visão de professor
                                        </Link>
                                    </div>
                                )}
                            </div>
                            
                            {/* Botão "Ver como aluno" para professores */}
                            {user.can_view_as_student && (
                                <Link
                                    href={route('view-as-student')}
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    👁️ Ver como aluno
                                </Link>
                            )}
                        </div>
                    </div>
                    
                    {/* Conteúdo específico por role */}
                    {renderDashboardContent()}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Helper function
function getRoleLabel(role) {
    const labels = {
        student: 'Estudante',
        teacher: 'Professor',
        researcher: 'Pesquisador',
        admin: 'Administrador'
    };
    return labels[role] || role;
}