import { useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
    const { flash, errors } = usePage().props;
    const shownValidation = useRef(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, { position: "top-right" });
        }
        if (flash?.error) {
            toast.error(flash.error, { position: "top-right" });
        }
        if (flash?.info) {
            toast.info(flash.info, { position: "top-right" });
        }
        if (flash?.warning) {
            toast.warn(flash.warning, { position: "top-right" });
        }
    }, [flash?.success, flash?.error, flash?.info, flash?.warning]);

    // Mostra um toast consolidado para erros de validação (primeira mudança de errors)
    useEffect(() => {
        if (
            !shownValidation.current &&
            errors &&
            Object.keys(errors).length > 0
        ) {
            const first = Object.values(errors)[0];
            toast.error(Array.isArray(first) ? first[0] : first, {
                position: "top-right",
            });
            shownValidation.current = true;
            // Reset flag após breve atraso para permitir novos toasts em próximas submissões
            setTimeout(() => {
                shownValidation.current = false;
            }, 2000);
        }
    }, [errors]);

    return <ToastContainer theme="colored" newestOnTop />;
}
