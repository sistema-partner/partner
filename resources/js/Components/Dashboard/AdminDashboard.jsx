import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminDashboard({ auth, teachers }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Aprovações Pendentes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Professores Pendentes</h2>
                        {teachers.map((teacher) => (
                            <div key={teacher.id} className="flex justify-between items-center mb-2 p-2 border rounded">
                                <div>{teacher.name} ({teacher.email})</div>
                                <div className="flex gap-2">
                                    <Link href={route('admin.approve', teacher.id)} method="patch" as="button" className="bg-green-500 text-white px-3 py-1 rounded">Aprovar</Link>
                                    <Link href={route('admin.reject', teacher.id)} method="delete" as="button" className="bg-red-500 text-white px-3 py-1 rounded">Rejeitar</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}