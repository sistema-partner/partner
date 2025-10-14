import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useRef, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';

/**
 * Modal de confirmação para deleção de curso.
 * Props:
 *  - show (bool)
 *  - onClose (fn)
 *  - course (obj) { id, title }
 */
export default function ConfirmDeleteCourseModal({ show, onClose, course }) {
    const cancelButtonRef = useRef(null);
    const { delete: destroy, processing } = useForm();

    useEffect(() => {
        if (show && cancelButtonRef.current) {
            // Foca no botão Cancelar quando o modal abre
            cancelButtonRef.current.focus();
        }
    }, [show]);

    const handleDelete = (e) => {
        e.preventDefault();
        if (!course) return;
        destroy(route('courses.destroy', course.id), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <form onSubmit={handleDelete} className="p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                <div className="flex items-start gap-3">
                    <div className="mt-1">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-1" id="delete-course-title">Excluir Curso</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400" id="delete-course-description">
                            Tem certeza de que deseja excluir o curso
                            {course && (
                                <> <span className="font-semibold text-gray-900 dark:text-gray-200">"{course.title}"</span></>
                            )}? Esta ação é permanente e removerá todos os dados relacionados (avisos, matrículas, etc.).
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton type="button" ref={cancelButtonRef} onClick={onClose} disabled={processing}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton
                        type="submit"
                        className="!bg-red-600 hover:!bg-red-700 focus:!ring-red-500/50"
                        disabled={processing}
                    >
                        {processing ? 'Excluindo...' : 'Excluir' }
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
