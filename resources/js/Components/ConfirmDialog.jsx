import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";

/**
 * ConfirmDialog - Modal genérico de confirmação com estilo Glass.
 * Props:
 *  - show: boolean
 *  - onClose: () => void
 *  - title: string
 *  - message: string | ReactNode
 *  - confirmLabel?: string (default 'Confirmar')
 *  - cancelLabel?: string (default 'Cancelar')
 *  - onConfirm: () => void | Promise
 *  - variant?: 'danger' | 'info' | 'warning'
 */
export default function ConfirmDialog({
    show,
    onClose,
    title,
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    onConfirm,
    variant = "warning",
}) {
    const cancelButtonRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (show && cancelButtonRef.current) {
            cancelButtonRef.current.focus();
        }
    }, [show]);

    const palette =
        {
            danger: {
                icon: "text-red-500",
                confirmBg:
                    "!bg-red-600 hover:!bg-red-700 focus:!ring-red-500/50",
            },
            warning: {
                icon: "text-amber-500",
                confirmBg:
                    "!bg-amber-600 hover:!bg-amber-700 focus:!ring-amber-500/50",
            },
            info: {
                icon: "text-indigo-500",
                confirmBg:
                    "!bg-indigo-600 hover:!bg-indigo-700 focus:!ring-indigo-500/50",
            },
        }[variant] || {};

    const handleConfirm = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        try {
            const result = onConfirm?.();
            if (result instanceof Promise) {
                await result;
            }
        } catch (error) {
            console.error("Erro ao confirmar:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <form onSubmit={handleConfirm} className="p-0">
                <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            <AlertTriangle
                                className={`h-6 w-6 ${palette.icon}`}
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
                                {title}
                            </h2>
                            <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {message}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton
                            type="button"
                            ref={cancelButtonRef}
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {cancelLabel}
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            className={palette.confirmBg}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <i className="pi pi-spin pi-spinner mr-2"></i>
                                    Processando...
                                </>
                            ) : (
                                confirmLabel
                            )}
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
