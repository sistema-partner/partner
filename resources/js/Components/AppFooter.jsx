import React from 'react';

/**
 * AppFooter
 * Props:
 *  - variant: 'default' | 'compact' (muda espaçamento vertical)
 *  - className: classes adicionais
 */
export default function AppFooter({ variant = 'default', className = '' }) {
  const padding = variant === 'compact' ? 'py-4' : 'py-6 sm:px-6 lg:px-8';
return (
    <footer className={`fixed bottom-0 left-0 w-full border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm mt-auto ${className}`}>
        <div className={`max-w-7xl mx-auto px-4 ${padding}`}>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Partner - Plataforma Educacional Inteligente • UFAL {new Date().getFullYear()}
            </div>
        </div>
    </footer>
);
}
