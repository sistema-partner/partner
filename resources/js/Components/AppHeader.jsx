import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import ThemeToggler from '@/Components/ThemeToggler';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Users, Eye, GraduationCap, BookOpen, BarChart3 } from 'lucide-react';

/**
 * AppHeader
 * Props:
 *  - user: usuário autenticado ou null
 *  - variant: 'public' | 'auth'
 *  - showRoleSwitcher: bool (default true)
 */
export default function AppHeader({ user, variant = 'public', showRoleSwitcher = true }) {
  const [openMobile, setOpenMobile] = useState(false);

  const getRoleLabel = (role) => {
    const labels = { student: 'Estudante', teacher: 'Professor', researcher: 'Pesquisador', admin: 'Administrador' };
    return labels[role] || role;
  };

  const isAuth = variant === 'auth' && !!user;

  return (
  <header className="relative z-30 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Partner</span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuth ? (
              <>
                <NavLink
                  href={route('dashboard')}
                  active={route().current('dashboard')}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  Dashboard
                </NavLink>
                {showRoleSwitcher && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    {user.is_viewing_as_student ? (
                      <>
                        <Eye className="h-4 w-4" />
                        <span>Visão: Estudante</span>
                      </>
                    ) : (
                      <>
                        {user.role === 'teacher' && <BookOpen className="h-4 w-4" />}
                        {user.role === 'student' && <GraduationCap className="h-4 w-4" />}
                        {user.role === 'researcher' && <BarChart3 className="h-4 w-4" />}
                        <span>Visão: {getRoleLabel(user.role)}</span>
                      </>
                    )}
                  </div>
                )}
                <ThemeToggler />
                {/* Dropdown */}
                <div className="relative">
                  <Dropdown>
                    <Dropdown.Trigger>
                      <span className="inline-flex rounded-md">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          {user.name}
                          <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-600">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">{getRoleLabel(user.role)}</div>
                      </div>
                      <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Meu Perfil
                      </Dropdown.Link>
                      {user.can_view_as_student && !user.is_viewing_as_student && (
                        <Dropdown.Link href={route('view-as-student')} method="post" as="button" className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                          <Eye className="w-4 h-4" /> Ver como Aluno
                        </Dropdown.Link>
                      )}
                      {user.is_viewing_as_student && (
                        <Dropdown.Link href={route('view-normal')} method="post" as="button" className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Voltar à Minha Visão
                        </Dropdown.Link>
                      )}
                      <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sair
                      </Dropdown.Link>
                    </Dropdown.Content>
                  </Dropdown>
                </div>
              </>
            ) : (
              // Public variant: se usuário já estiver autenticado, mostrar apenas Dashboard
              user ? (
                <Link
                  href={route('dashboard')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href={route('login')}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                  >
                    Entrar
                  </Link>
                  <Link
                    href={route('register')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                  >
                    Registrar
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuth && <ThemeToggler />}
            <button
              onClick={() => setOpenMobile(!openMobile)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path className={!openMobile ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                <path className={openMobile ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile expanded */}
      <div className={`${openMobile ? 'block' : 'hidden'} md:hidden border-t border-gray-200 dark:border-gray-700`}>        
        {isAuth ? (
          <div className="px-4 py-3 space-y-3">
            <div className="pb-3 border-b border-gray-200 dark:border-gray-600">
              <div className="text-base font-medium text-gray-900 dark:text-white">{user.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">{getRoleLabel(user.role)} • Visão: {getRoleLabel(user.effective_role)}</div>
            </div>
            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>
            {user.can_view_as_student && !user.is_viewing_as_student && (
              <ResponsiveNavLink href={route('view-as-student')} method="post" as="button" className="text-orange-600 dark:text-orange-400">
                <Eye className="w-4 h-4 inline mr-2" /> Ver como Aluno
              </ResponsiveNavLink>
            )}
            {user.is_viewing_as_student && (
              <ResponsiveNavLink href={route('view-normal')} method="post" as="button" className="text-green-600 dark:text-green-400">
                Voltar à Minha Visão
              </ResponsiveNavLink>
            )}
            <ResponsiveNavLink href={route('profile.edit')}>Meu Perfil</ResponsiveNavLink>
            <ResponsiveNavLink method="post" href={route('logout')} as="button" className="text-red-600 dark:text-red-400">Sair</ResponsiveNavLink>
          </div>
        ) : (
          <div className="px-4 py-3 space-y-3">
            <Link href={route('login')} className="block w-full text-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50">Entrar</Link>
            <Link href={route('register')} className="block w-full text-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700">Registrar</Link>
          </div>
        )}
      </div>
    </header>
  );
}
