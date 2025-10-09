import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm  } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

const AnnouncementForm = ({ course }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('courses.contents.store', course.id), {
            onSuccess: () => reset(), // Limpa o formulário após o sucesso
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <textarea
                value={data.body}
                onChange={e => setData('body', e.target.value)}
                placeholder="Escreva um aviso para a turma..."
                className="w-full border-border bg-background rounded-md shadow-sm"
                rows="3"
            ></textarea>
            {errors.body && <p className="text-sm text-red-600">{errors.body}</p>}
            <div className="flex justify-end">
                <PrimaryButton disabled={processing}>Postar Aviso</PrimaryButton>
            </div>
        </form>
    );
};

const EnrollmentStatusBadge = ({ status }) => {
    const statusClasses = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    const statusText = {
        pending: 'Pendente',
        approved: 'Aprovado',
        rejected: 'Rejeitado',
        cancelled: 'Cancelado',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
            {statusText[status] || status}
        </span>
    );
};


export default function Show({ auth, course }) {
    const pendingEnrollments = course.enrollments.filter(e => e.status === 'pending');
    const otherEnrollments = course.enrollments.filter(e => e.status !== 'pending');

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title={course.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Detalhes do Curso: {course.title}
                    </h1>
                    <div className="bg-card text-card-foreground p-6 shadow-sm sm:rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <h3 className="font-semibold">Título</h3>
                                <p className="text-muted-foreground">{course.title}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Código</h3>
                                <p className="text-muted-foreground">{course.code}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Status do Curso</h3>
                                <p className="text-muted-foreground">{course.status}</p>
                            </div>
                            <div className="col-span-1 md:col-span-3">
                                <h3 className="font-semibold">Descrição</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{course.description}</p>
                            </div>
                        </div>
                    </div>

                     <div className="bg-card text-card-foreground p-6 shadow-sm sm:rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Mural de Avisos</h3>

                        {/* Formulário para postar aviso */}
                        <div className="mb-6">
                            <AnnouncementForm course={course} />
                        </div>

                        {/* Lista de avisos postados */}
                        <div className="space-y-6">
                            {course.contents.filter(c => c.type === 'announcement').map(content => (
                                <div key={content.id} className="border-t border-border pt-4">
                                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                                        <span>Postado por: <strong>{content.author.name}</strong></span>
                                        <span>{new Date(content.created_at).toLocaleString('pt-BR')}</span>
                                    </div>
                                    <p className="whitespace-pre-wrap">{content.body}</p>
                                </div>
                            ))}
                            {course.contents.length === 0 && (
                                <p className="text-muted-foreground">Nenhum aviso postado ainda.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-card text-card-foreground p-6 shadow-sm sm:rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Solicitações de Matrícula Pendentes</h3>
                        {pendingEnrollments.length > 0 ? (
                            <ul className="divide-y divide-border">
                                {pendingEnrollments.map(enrollment => (
                                    <li key={enrollment.id} className="py-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{enrollment.student.name}</p>
                                            <p className="text-sm text-muted-foreground">{enrollment.student.email}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <EnrollmentStatusBadge status={enrollment.status} />
                                            <Link as="button" href={route('enrollments.approve', enrollment.id)} method="post" className="text-sm font-medium text-green-600 hover:text-green-800">Aprovar</Link>
                                            <Link as="button" href={route('enrollments.reject', enrollment.id)} method="post" className="text-sm font-medium text-red-600 hover:text-red-800">Rejeitar</Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">Nenhuma solicitação de matrícula pendente no momento.</p>
                        )}

                        {/* Lista de outras matrículas (opcional) */}
                        <h3 className="text-lg font-semibold mt-8 mb-4">Outras Matrículas</h3>
                         {otherEnrollments.length > 0 ? (
                            <ul className="divide-y divide-border">
                                {otherEnrollments.map(enrollment => (
                                    <li key={enrollment.id} className="py-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{enrollment.student.name}</p>
                                            <p className="text-sm text-muted-foreground">{enrollment.student.email}</p>
                                        </div>
                                        <EnrollmentStatusBadge status={enrollment.status} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-muted-foreground">Nenhuma outra matrícula encontrada.</p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Link href={route('dashboard')} className="text-sm text-muted-foreground hover:text-foreground">
                            &larr; Voltar para a lista de cursos
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}