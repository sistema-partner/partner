import React, { useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function PrimeImageUpload({
    label,
    value,              // File | null
    previewUrl = null,  // string | null (ex: courses/abc.png)
    onChange,
    error,
    maxFileSize = 2000000,
    accept = "image/*",
    multiple = false
}) {
    const fileUploadRef = useRef(null);
    const [files, setFiles] = useState([]);

    /**
     * Resolve qual imagem deve aparecer no preview
     */
    const resolvePreview = () => {
        if (files.length > 0 && files[0].objectURL) {
            return files[0].objectURL;
        }

        if (previewUrl) {
            return `/storage/${previewUrl}`;
        }

        return null;
    };

    /**
     * Quando o usuário seleciona um arquivo
     */
    const onSelect = (e) => {
        if (!e.files || e.files.length === 0) return;

        const file = e.files[e.files.length - 1];

        setFiles([file]);
        onChange?.(file);
    };

    /**
     * Remove imagem selecionada (não apaga no backend)
     */
    const clearImage = () => {
        setFiles([]);
        onChange?.(null);
    };

    /**
     * Template quando não há imagem
     */
    const emptyTemplate = () => {
        const preview = resolvePreview();

        if (preview) {
            return (
                <div className="relative w-full">
                    <img
                        src={preview}
                        alt="Imagem do curso"
                        className="w-full h-64 object-cover rounded-lg border"
                    />

                    <Button
                        type="button"
                        icon="pi pi-pencil"
                        className="p-button-rounded p-button-sm absolute bottom-3 right-3"
                        onClick={() => fileUploadRef.current?.getInput()?.click()}
                    />
                </div>
            );
        }

        return (
            <div
                onClick={() => fileUploadRef.current?.getInput()?.click()}
                className="cursor-pointer flex flex-col items-center justify-center min-h-[220px] p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition"
            >
                <i className="pi pi-image text-5xl mb-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    Clique ou arraste uma imagem
                </span>
                <span className="text-xs text-gray-400 mt-1">
                    Máx {(maxFileSize / 1000000).toFixed(0)}MB
                </span>
            </div>
        );
    };

    return (
        <div className="space-y-2">
            {label && <InputLabel value={label} />}

            <FileUpload
                ref={fileUploadRef}
                name="image"
                accept={accept}
                maxFileSize={maxFileSize}
                multiple={multiple}
                customUpload
                auto={false}
                onSelect={onSelect}
                onClear={clearImage}
                emptyTemplate={emptyTemplate}
                uploadHandler={() => {}}
                className="w-full"
            />

            {(files.length > 0 || previewUrl) && (
                <div className="flex justify-end">
                    <Button
                        type="button"
                        icon="pi pi-trash"
                        label="Remover imagem"
                        severity="danger"
                        outlined
                        size="small"
                        onClick={clearImage}
                    />
                </div>
            )}

            {error && <InputError message={error} />}
        </div>
    );
}
