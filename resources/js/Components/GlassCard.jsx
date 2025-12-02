import React from 'react';

/**
 * GlassCard
 * Wrapper translúcido reutilizável.
 * Props:
 *  - children: conteúdo interno
 *  - className: classes adicionais de layout / espaçamento
 *  - title?: string (opcional)
 *  - description?: string (opcional)
 *  - padding?: sm | md | lg (default md) controla p-x/p-y
 */
export default function GlassCard({
  children,
  className = '',
  title,
  description,
  padding = 'md',
}) {
  const paddingMap = {
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  };
  const pad = paddingMap[padding] || paddingMap.md;

  return (
    <div className={`bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl ${pad} ${className}`}>
      {(title || description) && (
        <div className="mb-5">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
