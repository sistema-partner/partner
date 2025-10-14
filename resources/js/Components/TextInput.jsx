import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

/**
 * TextInput
 * Visual atualizado para alinhar com GlassCard / dashboard.
 * Props adicionais:
 *  - isFocused: auto-focus
 *  - error: boolean para estado de erro (borda/vermelho)
 */
export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, error = false, disabled = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const baseClasses = [
        'block w-full rounded-lg',
        'border bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm',
        'text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
        'shadow-sm transition-colors',
        'focus:outline-none focus:ring-2',
        disabled ? 'opacity-60 cursor-not-allowed' : 'focus:ring-indigo-500/50',
        error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40'
            : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500',
    ].join(' ');

    return (
        <input
            {...props}
            ref={localRef}
            type={type}
            disabled={disabled}
            aria-invalid={error || undefined}
            className={baseClasses + (className ? ' ' + className : '')}
        />
    );
});
