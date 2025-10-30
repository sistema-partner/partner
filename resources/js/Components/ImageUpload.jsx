import { useState, useRef, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";

export default function ImageUpload({
    label,
    name,
    value,
    existingUrl = null, // URL já existente no servidor (não enviada para o backend como arquivo)
    onChange,
    error,
    helper = null,
}) {
    const [preview, setPreview] = useState(null);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        // Se usuário selecionou novo arquivo
        if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
        // Se não há novo arquivo, mas existe URL anterior
        if (!value && existingUrl) {
            setPreview(existingUrl);
            return;
        }
        // Caso contrário limpa preview
        setPreview(null);
    }, [value, existingUrl]);

    const handleFiles = (files) => {
        if (!files || !files.length) return;
        onChange(files[0]);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        if (!dragging) setDragging(true);
    };

    const onDragLeave = () => setDragging(false);

    const clearImage = () => {
        onChange(null);
        // Mantém existingUrl? Decidimos limpar preview completamente.
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="space-y-2">
            {label && <InputLabel htmlFor={name} value={label} />}
            <div
                className={`relative group border-2 border-dashed rounded-xl p-4 transition-colors cursor-pointer flex flex-col items-center justify-center text-center min-h-[180px] overflow-hidden bg-white dark:bg-gray-800/70 backdrop-blur-sm ${
                    dragging
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                        : "border-gray-300 dark:border-gray-600 hover:border-indigo-400"
                } ${preview ? "pt-0" : ""}`}
                onClick={() => inputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
            >
                {/* Preview */}
                {preview && (
                    <div className="w-full h-40 rounded-md overflow-hidden mb-3 relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                clearImage();
                            }}
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition"
                            aria-label="Remover imagem"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {!preview && (
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="h-14 w-14 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-3 ring-1 ring-indigo-200 dark:ring-indigo-400/30">
                            <ImageIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Arraste e solte uma imagem ou{" "}
                            <span className="text-indigo-600 dark:text-indigo-400">
                                clique para selecionar
                            </span>
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Formatos suportados: JPG, PNG, WEBP. Máx 4MB.
                        </p>
                    </div>
                )}

                <input
                    ref={inputRef}
                    id={name}
                    name={name}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />

                {/* Overlay state */}
                <div
                    className={`pointer-events-none absolute inset-0 rounded-xl transition ${
                        dragging
                            ? "ring-2 ring-indigo-400 dark:ring-indigo-300"
                            : ""
                    }`}
                ></div>
            </div>
            {helper && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {helper}
                </p>
            )}
            <InputError message={error} />
        </div>
    );
}
