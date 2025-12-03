import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import ContentViewer from "@/Components/ContentViewer";

export default function Show({ auth, content, course }) {
    console.log(content)
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={content.title || "Conteúdo"} />
            <div className="py-6">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {content.title || "Conteúdo"}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Parte do curso: {course.title}
                            </p>
                        </div>
                        <Link
                            href={route("courses.details", course.id)}
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Voltar ao Curso
                        </Link>
                    </div>
                    <ContentViewer content={content} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
