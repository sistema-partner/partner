import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { PlusCircle } from "lucide-react";

const StatusBadge = ({ status }) => {
    const statusClasses = {
        planned:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        ended: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    const statusText = {
        planned: "Planejado",
        active: "Ativo",
        ended: "Finalizado",
        cancelled: "Cancelado",
    };

    return (
        <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                statusClasses[status] || "bg-gray-100"
            }`}
        >
            {statusText[status] || status}
        </span>
    );
};

export default function Index({ auth, courses }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Meus Cursos" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Dashboard
                        </h1>
                        <Link
                            href={route("courses.create")}
                            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Criar Novo Curso
                        </Link>
                    </div>

                    <div className="bg-card text-card-foreground overflow-hidden shadow-sm sm:rounded-lg">
                        {courses.length === 0 ? (
                            <div className="p-6">
                                <p>Você ainda não criou nenhum curso.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-background">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                            >
                                                Título
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                            >
                                                Período
                                            </th>
                                            <th
                                                scope="col"
                                                className="relative px-6 py-3"
                                            >
                                                <span className="sr-only">
                                                    Ações
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {courses.map((course) => (
                                            <tr
                                                key={course.id}
                                                className="hover:bg-muted/50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        {(course.image_url ||
                                                            course.cover_url) && (
                                                            <img
                                                                src={
                                                                    course.image_url ||
                                                                    course.cover_url
                                                                }
                                                                alt={
                                                                    course.title
                                                                }
                                                                className="h-12 w-16 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-medium">
                                                                {course.title}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {course.code}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge
                                                        status={course.status}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                    {new Date(
                                                        course.start_date
                                                    ).toLocaleDateString()}{" "}
                                                    -{" "}
                                                    {new Date(
                                                        course.end_date
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route(
                                                                "courses.show",
                                                                course.id
                                                            )}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            Ver
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "courses.edit",
                                                                course.id
                                                            )}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "courses.destroy",
                                                                course.id
                                                            )}
                                                            method="delete"
                                                            as="button"
                                                            className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400"
                                                            onBefore={() =>
                                                                confirm(
                                                                    "Tem certeza que deseja excluir este curso?"
                                                                )
                                                            }
                                                        >
                                                            Excluir
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
