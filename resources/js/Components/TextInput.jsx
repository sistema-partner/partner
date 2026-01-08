import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

/**
 * TextInput
 * Componente atualizado para usar PrimeReact com tema personalizado
 * Props adicionais:
 *  - isFocused: auto-focus
 *  - error: boolean para estado de erro (borda/vermelho)
 *  - textarea: transforma o input em um textarea quando true
 */
export default forwardRef(function TextInput(
    { 
        type = 'text', 
        className = '', 
        isFocused = false, 
        error = false, 
        disabled = false,
        textarea = false,
        rows = 3,
        placeholder,
        value,
        onChange,
        ...props 
    },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
        getValue: () => localRef.current?.value,
        setValue: (value) => {
            if (localRef.current) {
                localRef.current.value = value;
            }
        },
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const baseClasses = [
        'rounded-lg',
        'w-full',
        'bg-light-card dark:bg-dark-card',
        'text-light-foreground dark:text-dark-foreground',
        'placeholder:text-light-muted-foreground dark:placeholder:text-dark-muted-foreground',
        'border',
        error 
            ? 'border-light-destructive dark:border-dark-destructive' 
            : 'border-light-border dark:border-dark-border',
        'focus:outline-none focus:ring-2',
        error
            ? 'focus:border-light-destructive dark:focus:border-dark-destructive focus:ring-light-destructive/20 dark:focus:ring-dark-destructive/20'
            : 'focus:border-light-primary dark:focus:border-blue-light focus:ring-light-primary/20 dark:focus:ring-blue-light/20',
        disabled ? 'opacity-60 cursor-not-allowed' : '',
        'transition-colors duration-200',
        textarea ? 'p-3' : 'px-3 py-2',
    ].join(' ');

    const textareaClasses = textarea 
        ? 'resize-y min-h-[80px]' 
        : '';

    if (textarea) {
        return (
            <InputTextarea
                ref={localRef}
                rows={rows}
                disabled={disabled}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`${baseClasses} ${textareaClasses} ${className}`}
                {...props}
            />
        );
    }

    return (
        <InputText
            ref={localRef}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`${baseClasses} ${className}`}
            {...props}
        />
    );
});