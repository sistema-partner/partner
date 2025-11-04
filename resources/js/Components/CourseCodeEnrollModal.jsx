import { useForm, Link } from "@inertiajs/react";
import GlassCard from "@/Components/GlassCard";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import { X, KeyRound } from "lucide-react";

export default function CourseCodeEnrollModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: "",
    });

    if (!show) return null;

    const submit = (e) => {
        e.preventDefault();
        post(route("enrollments.by_code"), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <GlassCard className="relative w-full max-w-md p-0 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-indigo-500" /> Entrar
                        com Código
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
                <form onSubmit={submit} className="px-5 py-5 space-y-4">
                    <div>
                        <label
                            htmlFor="code"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Código do Curso
                        </label>
                        <input
                            id="code"
                            type="text"
                            value={data.code}
                            onChange={(e) =>
                                setData("code", e.target.value.toUpperCase())
                            }
                            placeholder="Ex: ABC123"
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono tracking-widest"
                            required
                            maxLength={8}
                        />
                        <InputError message={errors.code} className="mt-2" />
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            O código é composto por letras e números e garante
                            matrícula imediata.
                        </p>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                            Cancelar
                        </button>
                        <PrimaryButton disabled={processing}>
                            Matricular
                        </PrimaryButton>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}
