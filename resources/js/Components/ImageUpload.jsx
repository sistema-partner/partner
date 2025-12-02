import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";

export default function ImageUpload({ value, onChange }) {
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    // Atualiza preview quando um File chega via onChange
    useEffect(() => {
        if (value instanceof File) {
            const url = URL.createObjectURL(value);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }

        if (!value) setPreview(null);
    }, [value]);

    // Handler de seleção manual
    const handleSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) simulateUpload(file);
    };

    // Handler do Drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) simulateUpload(file);
    };

    const simulateUpload = (file) => {
        setUploading(true);

        setTimeout(() => {
            onChange(file);
            setUploading(false);
        }, 800);
    };

    const removeImage = () => {
        onChange(null);
        setPreview(null);
    };

    return (
        <div className="w-full">
            {/* Área principal */}
            <div
                className={`
                    border-2 border-dashed rounded-xl p-6 transition 
                    flex flex-col items-center justify-center gap-3 cursor-pointer
                    ${dragActive ? "border-blue-400 bg-blue-50/50" : "border-gray-300"}
                `}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
            >
                {/* Preview */}
                {preview && !uploading && (
                    <div className="w-full">
                        <div className="relative group">
                            <img
                                src={preview}
                                className="w-full h-48 object-cover rounded-lg shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                className="
                                    absolute top-2 right-2 p-1.5 rounded-full bg-white 
                                    shadow hover:bg-gray-100 transition
                                "
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Uploading State */}
                {uploading && (
                    <div className="flex flex-col items-center gap-2 py-6">
                        <Loader2 className="animate-spin text-gray-500" size={28} />
                        <p className="text-sm text-gray-600">Enviando…</p>
                    </div>
                )}

                {/* Estado vazio */}
                {!preview && !uploading && (
                    <>
                        <Upload className="text-gray-400" size={32} />
                        <p className="text-sm text-gray-600 text-center">
                            Arraste uma imagem aqui ou clique para selecionar
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, WEBP · Máx. 5MB</p>
                    </>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSelect}
                />
            </div>
        </div>
    );
}
