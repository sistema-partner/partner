import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

const CourseCard = ({ course }) => (
    <div className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        {(course.image_url ) && (
            <img
                src={course.image_url}
                alt={course.title}
                className="w-full h-40 object-cover"
            />
        )}
        {!(course.image_url) && (
            <div className="w-full h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 text-sm">
                Sem imagem
            </div>
        )}
        <div className="p-4">
            <h3 className="font-bold text-lg">{course.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
                Por: {course.teacher.name}
            </p>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {course.description}
            </p>
            <div className="mt-4 flex justify-end">
                <Link
                    href={route("courses.details", course.id)}
                    className="text-sm font-semibold text-primary hover:underline"
                >
                    Ver Detalhes &rarr;
                </Link>
            </div>
        </div>
    </div>
);

export default function Explore({ auth, courses }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Explorar Cursos" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Explorar Cursos
                    </h1>
                    {courses.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.data.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
                            Nenhum curso disponível no momento.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
