import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

const EnrollmentButton = ({ course, enrollmentStatus }) => {
    const { flash } = usePage().props;

    if (enrollmentStatus) {
        if (enrollmentStatus.status === "pending") {
            return (
                <div className="mt-4 p-2 text-center bg-blue-100 text-blue-800 rounded-md">
                    Solicitação Pendente
                </div>
            );
        }
        if (enrollmentStatus.status === "approved") {
            return null;
        }
    }

    if (flash?.success) {
        return (
            <div className="mt-4 p-2 text-center bg-green-100 text-green-800 rounded-md">
                {flash.success}
            </div>
        );
    }
    if (flash?.error) {
        return (
            <div className="mt-4 p-2 text-center bg-red-100 text-red-800 rounded-md">
                {flash.error}
            </div>
        );
    }

    if (!course.accepts_enrollments) {
        return (
            <PrimaryButton className="mt-6 w-full justify-center" disabled>
                Matrículas Encerradas
            </PrimaryButton>
        );
    }

    return (
        <Link
            href={route("enrollments.store", course.id)}
            method="post"
            as="button"
            className="mt-6 w-full justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2"
        >
            Solicitar Inscrição
        </Link>
    );
};

export default function PublicShow({ auth, course, enrollmentStatus }) {
    const announcements = (course.contents || []).filter(
        (content) => content.type === "announcement"
    );

    const isEnrolled = enrollmentStatus?.status === "approved";

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={course.title} />

            <div className="max-w-4xl mx-auto px-4 space-y-6 pb-6 relative mt-6">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition"
                >
                    <ArrowLeft size={18} />
                    Voltar
                </button>
                <img
                    src={
                        course.cover_url ||
                        course.image_url ||
                        "https://placehold.co/1200x300?text=Capa+do+Curso"
                    }
                    alt={course.title}
                    className="w-full h-64 object-cover opacity-70 rounded-lg"
                />
                <div className="absolute bottom-10 left-8">
                    <h1 className="text-3xl font-bold drop-shadow-md flex items-center gap-3">
                        {course.image_url && !course.cover_url && (
                            <img
                                src={course.image_url}
                                alt={course.title}
                                className="h-12 w-12 object-cover rounded-md ring-2 ring-white/60"
                            />
                        )}
                        {course.title}
                    </h1>
                    <p className="text-lg font-bold opacity-90">
                        Por {course.teacher.name}
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 space-y-6 pb-12">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">
                        {course.description}
                    </p>

                    {auth.user.role === "student" && (
                        <EnrollmentButton
                            course={course}
                            enrollmentStatus={enrollmentStatus}
                        />
                    )}
                </div>

                {isEnrolled && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold mb-4">Mural</h3>
                        <div className="space-y-6">
                            {announcements.length > 0 ? (
                                announcements.map((content) => (
                                    <div
                                        key={content.id}
                                        className="border-t border-gray-200 pt-4 bg-white rounded-lg shadow p-6"
                                    >
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                            <span>
                                                Postado por{" "}
                                                <strong>
                                                    {content.author.name}
                                                </strong>
                                            </span>
                                            <span>
                                                {new Date(
                                                    content.created_at
                                                ).toLocaleString("pt-BR")}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 whitespace-pre-wrap">
                                            {content.body}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">
                                    Nenhum aviso postado neste curso ainda.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
