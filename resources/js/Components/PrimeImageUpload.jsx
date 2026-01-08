import React, { useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function PrimeImageUpload({ 
    label, 
    value, 
    onChange, 
    error, 
    maxFileSize = 2000000,
    accept = "image/*",
    multiple = false
}) {
    const fileUploadRef = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const [files, setFiles] = useState(value ? [value] : []);

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let selectedFiles = e.files;

        Object.keys(selectedFiles).forEach((key) => {
            _totalSize += selectedFiles[key].size || 0;
        });

        setTotalSize(_totalSize);
        
        if (!multiple && selectedFiles.length > 0) {
            const lastFile = selectedFiles[selectedFiles.length - 1];
            setFiles([lastFile]);
            onChange?.(lastFile);
        } else {
            setFiles(prev => [...prev, ...selectedFiles]);
            onChange?.(multiple ? [...files, ...selectedFiles] : selectedFiles[selectedFiles.length - 1]);
        }
    };

    const onTemplateRemove = (file, callback) => {
        const newFiles = files.filter(f => f.name !== file.name);
        setFiles(newFiles);
        setTotalSize(totalSize - file.size);
        onChange?.(multiple ? newFiles : null);
        callback();
    };

    const onTemplateClear = () => {
        setFiles([]);
        setTotalSize(0);
        onChange?.(multiple ? [] : null);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef?.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                {files.length > 0 && (
                    <div className="flex align-items-center gap-3 ml-auto">
                        <span className="text-sm" style={{ color: 'var(--text-color-secondary)' }}>
                            {formatedValue} / {(maxFileSize / 1000000).toFixed(0)} MB
                        </span>
                        <ProgressBar 
                            value={value} 
                            showValue={false} 
                            style={{ width: '10rem', height: '12px' }}
                        />
                    </div>
                )}
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div 
                className="flex align-items-center flex-wrap gap-4 p-3" 
                style={{ 
                    borderBottom: '1px solid var(--surface-border)',
                    backgroundColor: 'var(--surface-card)'
                }}
            >
                <div className="flex align-items-center flex-1 min-w-0">
                    <img 
                        alt={file.name} 
                        role="presentation" 
                        src={file.objectURL} 
                        className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex flex-column ml-3">
                        <span className="font-medium truncate max-w-xs" style={{ color: 'var(--text-color)' }}>
                            {file.name}
                        </span>
                        <small style={{ color: 'var(--text-color-secondary)' }}>
                            {new Date().toLocaleDateString()}
                        </small>
                    </div>
                </div>
                <Tag 
                    value={props.formatSize} 
                    severity="warning" 
                    className="px-3 py-2"
                />
                <Button 
                    type="button" 
                    icon="pi pi-times" 
                    className="p-button-outlined p-button-rounded p-button-danger"
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div
                onClick={() => fileUploadRef.current?.getInput()?.click()}
                className="cursor-pointer flex flex-col items-center justify-center min-h-[200px] p-8 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition"
            >
                <i className="pi pi-image text-5xl mb-4 text-gray-400" />

                <span className="text-lg mb-1 text-gray-600 dark:text-gray-300">
                    Arraste e solte a imagem aqui
                </span>

                <span className="text-sm text-gray-500">
                    ou clique para selecionar
                </span>

                <span className="text-xs mt-2 text-gray-400">
                    Máx: {(maxFileSize / 1000000).toFixed(0)}MB
                </span>
            </div>
        );
    };

    const chooseOptions = { 
        icon: 'pi pi-fw pi-images', 
        iconOnly: true, 
        className: 'custom-choose-btn p-button-rounded p-button-outlined'
    };
    
    const uploadOptions = { 
        icon: 'pi pi-fw pi-cloud-upload', 
        iconOnly: true, 
        className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'
    };
    
    const cancelOptions = { 
        icon: 'pi pi-fw pi-times', 
        iconOnly: true, 
        className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'
    };

    return (
        <div className="">
            {label && <InputLabel value={label} />}
            
            <FileUpload
                ref={fileUploadRef}
                name="image"
                url="/api/upload"
                multiple={multiple}
                accept={accept}
                maxFileSize={maxFileSize}
                onSelect={onTemplateSelect}
                onClear={onTemplateClear}
                onRemove={(e) => onTemplateRemove(e.file, e.options.onRemove)}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
                customUpload={true}
                uploadHandler={() => {}}
                className="w-full"
            />
            
            {error && <InputError message={error} />}
        </div>
    );
}