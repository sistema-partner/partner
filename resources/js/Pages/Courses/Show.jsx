import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import GlassCard from "@/Components/GlassCard";
import { useState, useEffect } from "react";
import { 
    ClipboardCopy, ClipboardCheck, Check, X, ChevronRight, ChevronDown,
    PlayCircle, FileText, Link as LinkIcon, Calendar, User, Clock, 
    BookOpen, MessageSquare, Plus, Edit2, Trash2 
} from "lucide-react";
import InputLabel from '@/Components/InputLabel';
import TagInput from '@/Components/TagInput'; 
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import ContentSelectModal from '@/Components/ContentSelectModal';

const ModuleFormModal = ({ show, onClose, module = null, courseId }) => {
    const isEditing = !!module;
    const { data, setData, post, patch, processing, reset, errors } = useForm({
        title: module?.title || '',
        description: module?.description || '',
    });

    useEffect(() => {
        if (module) {
            setData({
                title: module.title || '',
                description: module.description || ''
            });
        } else {
            reset();
        }
    }, [module, show]);

    const submit = (e) => {
        e.preventDefault();
        const routeName = isEditing ? 'modules.update' : 'modules.store';
        const routeParam = isEditing ? module.id : courseId;
        const method = isEditing ? patch : post;

        method(route(routeName, routeParam), {
            onSuccess: () => { reset(); onClose(); }
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                {/* Header do Modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {isEditing ? 'Editar Módulo' : 'Novo Módulo'}
                        </h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Corpo do Formulário */}
                <div className="p-6">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel value="Título do Módulo" className="mb-1.5 dark:text-white" />
                            <TextInput 
                                value={data.title} 
                                onChange={e => setData('title', e.target.value)} 
                                className="w-full" 
                                placeholder="Ex: Introdução ao Curso"
                                autoFocus
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>}
                        </div>
                        
                        <div>
                            <InputLabel value="Descrição (Opcional)" className="mb-1.5 dark:text-white" />
                            <TextInput 
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)} 
                                className="w-full"
                                placeholder="Uma breve descrição sobre o que será abordado..." 
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description}</p>}
                        </div>

                        {/* Footer com Ações */}
                        <div className="flex items-center justify-end gap-3 pt-4 mt-2">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Cancelar
                            </button>
                            <PrimaryButton disabled={processing} className="rounded-lg">
                                {isEditing ? 'Salvar Alterações' : 'Criar Módulo'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

const AnnouncementForm = ({ course, contentTags }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        body: "",
        tags: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("courses.contents.store", course.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submit} className="space-y-3">
            <textarea
                value={data.body}
                onChange={(e) => setData("body", e.target.value)}
                placeholder="Escreva um aviso para a turma..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                rows="3"
            />
            {errors.body && (
                <p className="text-sm text-red-600">{errors.body}</p>
            )}
            <div>
                <InputLabel htmlFor="content_tags" value="Tags do Conteúdo" />
                <TagInput
                    id="content_tags"
                    options={contentTags}
                    value={data.tags}
                    onChange={(selectedOptions) => setData('tags', selectedOptions)}
                />
            </div>
            <div className="flex justify-end">
                <PrimaryButton disabled={processing}>
                    Postar Aviso
                </PrimaryButton>
            </div>
        </form>
    );
};

const EnrollmentStatusBadge = ({ status }) => {
    const statusClasses = {
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
    const statusText = {
        pending: "Pendente",
        approved: "Aprovado",
        rejected: "Rejeitado",
        cancelled: "Cancelado",
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
            {statusText[status] || status}
        </span>
    );
};

const ContentIcon = ({ type }) => {
    switch (type) {
        case 'video': return <PlayCircle size={16} className="text-blue-600" />;
        case 'pdf': 
        case 'document': return <FileText size={16} className="text-red-500" />;
        case 'link': return <LinkIcon size={16} className="text-gray-500" />;
        default: return <FileText size={16} className="text-gray-500" />;
    }
};

const Breadcrumbs = ({ items }) => (
    <nav className="flex items-center text-sm text-gray-300 mb-4">
        {items.map((item, index) => (
            <div key={index} className="flex items-center">
                {index > 0 && <ChevronRight size={14} className="mx-2 text-gray-500" />}
                {item.href ? (
                    <Link href={item.href} className="hover:text-white transition-colors">
                        {item.label}
                    </Link>
                ) : (
                    <span className="text-white font-medium truncate max-w-[200px] sm:max-w-xs">
                        {item.label}
                    </span>
                )}
            </div>
        ))}
    </nav>
);

export default function Show({ auth, course, contentTags }) {
    const [activeTab, setActiveTab] = useState('content');
    const [copied, setCopied] = useState(false);
    
    const [moduleModal, setModuleModal] = useState({ show: false, module: null });
    const [selectContentModal, setSelectContentModal] = useState({ show: false, moduleId: null });

    const isTeacher = auth.user.id === course.teacher.id;
    const pendingEnrollments = course.enrollments?.filter(e => e.status === "pending") || [];
    const otherEnrollments = course.enrollments?.filter(e => e.status !== "pending") || [];

    const [fromExplore, setFromExplore] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('origin') === 'explore') {
            setFromExplore(true);
        }
    }, []);

    const deleteModule = (moduleId) => {
        if(confirm('Tem certeza? Todo o conteúdo deste módulo será perdido.')) {
            router.delete(route('modules.destroy', moduleId));
        }
    }

    const deleteContent = (moduleId, contentId) => {
        if(confirm('Remover este conteúdo?')) {
            router.delete(route('modules.contents.destroy', { module: moduleId, content: contentId }));
        }
    }

    const handleAttachContent = (data) => {
        const moduleId = selectContentModal.moduleId;
        
        router.post(route('modules.contents.store', moduleId), data, {
            onSuccess: () => setSelectContentModal({ show: false, moduleId: null }),
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const formatRelative = (dateString) => { 
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const mins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMs / 3600000);
        const days = Math.floor(diffMs / 86400000);
        if (mins < 1) return "agora";
        if (mins < 60) return `${mins}m atrás`;
        if (hours < 24) return `${hours}h atrás`;
        if (days < 7) return `${days}d atrás`;
        return date.toLocaleDateString("pt-BR");
    };

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(course.code);
        } catch (err) {
            try {
                const textarea = document.createElement("textarea");
                textarea.value = course.code;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            } catch (_) { /* ignore */ }
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const breadcrumbsItems = [
        { label: 'Home', href: route('dashboard') },
        ...(fromExplore ? [{ label: 'Explorar Cursos', href: route('courses.explore') }] : []),
        { label: course.title, href: null }
    ];

    console.log(auth, course, contentTags);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={course.title} />

            <div className="bg-gray-900 text-white pt-8 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="w-full lg:w-2/3">
                        <Breadcrumbs items={breadcrumbsItems} />
                        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{course.title}</h1>
                        <p className="text-lg text-gray-300 mb-6 line-clamp-3">{course.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                            {course.tags && course.tags.map(tag => (
                                <span key={tag.id} className="bg-indigo-600 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
                                    {tag.name}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-indigo-400" />
                                <span>Criado por <span className="text-indigo-400 underline">{course.teacher?.name}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>Atualizado em {formatDate(course.updated_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>Início: {formatDate(course.start_date)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                    
                    {/* Main Content (Order 2 on Mobile, Order 1 on Desktop) */}
                    <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
                        
                        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto scrollbar-hide">
                            {['content', 'about', 'announcements'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 px-4 font-medium text-sm whitespace-nowrap capitalize ${activeTab === tab ? 'border-b-2 border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {tab === 'content' ? 'Conteúdo' : tab === 'about' ? 'Sobre' : 'Avisos'}
                                </button>
                            ))}
                            {isTeacher && (
                                <button 
                                    onClick={() => setActiveTab('manage')}
                                    className={`pb-3 px-4 font-medium text-sm whitespace-nowrap ${activeTab === 'manage' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-indigo-500 hover:text-indigo-700'}`}
                                >
                                    Gerenciar Alunos
                                </button>
                            )}
                        </div>

                        {activeTab === 'content' && (
                            <div className="space-y-6">
                                {/* Header da Seção de Módulos */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-500/10 rounded-lg">
                                            <BookOpen className="h-5 w-5 text-orange-500" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Estrutura do Curso
                                        </h2>
                                    </div>
                                    {isTeacher && (
                                        <button
                                            type="button"
                                            onClick={() => setModuleModal({ show: true, module: null })}
                                            className="inline-flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                        >
                                            <Plus className="h-4 w-4" />
                                            <span className="hidden sm:inline">Adicionar Módulo</span>
                                            <span className="sm:hidden">Add</span>
                                        </button>
                                    )}
                                </div>

                                {/* Lista de Módulos (Estilo Dropdown/Card) */}
                                {course.modules && course.modules.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30">
                                        <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                            Nenhum módulo adicionado
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                                            {isTeacher 
                                                ? "Comece adicionando módulos para organizar o conteúdo do seu curso." 
                                                : "Este curso ainda não possui módulos."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {course.modules.map((m, idx) => (
                                            <details
                                                key={m.id}
                                                className="group relative border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 open:ring-1 open:ring-blue-500/20"
                                            >
                                                {/* Summary (Header do Dropdown) */}
                                                <summary className="flex items-start justify-between p-4 sm:p-6 cursor-pointer list-none select-none">
                                                    <div className="flex items-center gap-3 w-full">
                                                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg font-semibold text-sm">
                                                            {idx + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0 mr-4">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                                                                    {m.title}
                                                                </h3>
                                                                <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-300 group-open:rotate-180" />
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {m.is_public ? (
                                                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Público</span>
                                                                ) : (
                                                                    <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">Privado</span>
                                                                )}
                                                                {m.description && (
                                                                    <span className="text-sm text-gray-500 dark:text-gray-400 border-l border-gray-300 dark:border-gray-600 pl-2 line-clamp-1">
                                                                        {m.description}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {isTeacher && (
                                                        <div className="flex items-center gap-2 ml-4">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.preventDefault(); setModuleModal({ show: true, module: m }) }}
                                                                className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors z-10 relative"
                                                                title="Editar Módulo"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.preventDefault(); deleteModule(m.id) }}
                                                                className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors z-10 relative"
                                                                title="Excluir Módulo"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </summary>

                                                {/* Conteúdos do Módulo (Expansível) */}
                                                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                                                    <div className="flex items-center justify-between mb-3 mt-2">
                                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                            Conteúdos ({m.contents?.length || 0})
                                                        </span>
                                                        {isTeacher && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectContentModal({ show: true, moduleId: m.id })}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                                Adicionar
                                                            </button>
                                                        )}
                                                    </div>
                                                    
                                                    {(!m.contents || m.contents.length === 0) ? (
                                                        <div className="text-center py-6 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/30 dark:bg-gray-900/20">
                                                            <FileText className="h-6 w-6 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                                Nenhum conteúdo adicionado
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="grid gap-2">
                                                            {m.contents.map((c) => (
                                                                <div
                                                                    key={c.id}
                                                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                                                        <div className="flex-shrink-0">
                                                                            <ContentIcon type={c.type} />
                                                                        </div>
                                                                        <div className="min-w-0 flex-1">
                                                                            <Link 
                                                                                href={route("contents.show", c.pivot?.id || c.id)}
                                                                                className="font-medium text-gray-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                                                                            >
                                                                                {c.title}
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 ml-4">
                                                                        <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-semibold rounded-md uppercase border border-blue-100 dark:border-blue-800">
                                                                            {c.type}
                                                                        </span>
                                                                        {c.is_public && (
                                                                            <span className="hidden sm:inline-block px-2 py-0.5 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-[10px] font-semibold rounded-md uppercase border border-green-100 dark:border-green-800">
                                                                                Grátis
                                                                            </span>
                                                                        )}
                                                                        {isTeacher && (
                                                                            <button 
                                                                                onClick={() => deleteContent(m.id, c.id)} 
                                                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                                                title="Remover Conteúdo"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Descrição do Curso</h3>
                                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {course.description}
                                </div>
                                {isTeacher && (
                                    <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                        <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">Código de Acesso</h4>
                                        <div className="flex items-center gap-3">
                                            <code className="text-lg font-mono font-bold bg-white dark:bg-gray-900 px-3 py-1 rounded border">{course.code}</code>
                                            <button 
                                                onClick={handleCopyCode} 
                                                className="inline-flex items-center gap-1 rounded-md border border-indigo-300/60 dark:border-indigo-600/40 bg-indigo-50/60 dark:bg-indigo-900/40 px-2 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/70 transition-colors"
                                            >
                                                {copied ? <ClipboardCheck size={16}/> : <ClipboardCopy size={16}/>} 
                                                {copied ? 'Copiado' : 'Copiar'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'announcements' && (
                            <div className="space-y-6">
                                {isTeacher && <AnnouncementForm course={course} contentTags={contentTags} />}
                                <div className="space-y-4">
                                    {course.contents.filter(c => c.type === "announcement").map((content) => (
                                        <div key={content.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 shadow-sm">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                    {content.author.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{content.author.name}</p>
                                                    <p className="text-xs text-gray-500">Postado em {new Date(content.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{content.body}</p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {content.tags?.map((tag) => (
                                                    <span key={tag.id} className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {course.contents.filter(c => c.type === "announcement").length === 0 && (
                                        <p className="text-center text-gray-500 py-8">Nenhum aviso postado ainda.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'manage' && isTeacher && (
                            <div className="space-y-8">
                                <GlassCard title="Solicitações Pendentes" description="Gerencie as solicitações de matrícula.">
                                    {pendingEnrollments.length > 0 ? (
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                                            {pendingEnrollments.map(enrollment => (
                                                <div key={enrollment.id} className="group relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50 p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                                                                {enrollment.student.name.slice(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">{enrollment.student.name}</p>
                                                                <p className="text-[11px] text-gray-500 dark:text-gray-400 break-all">{enrollment.student.email}</p>
                                                            </div>
                                                        </div>
                                                        <EnrollmentStatusBadge status={enrollment.status} />
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">Solicitado {formatRelative(enrollment.created_at)}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <Link as="button" href={route("enrollments.approve", enrollment.id)} method="post" className="flex-1 flex justify-center items-center gap-1 p-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold"><Check size={14}/> Aprovar</Link>
                                                        <Link as="button" href={route("enrollments.reject", enrollment.id)} method="post" className="flex-1 flex justify-center items-center gap-1 p-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-semibold"><X size={14}/> Rejeitar</Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center border-dashed border-2 border-gray-200 dark:border-gray-700 rounded-lg">
                                            <p className="text-gray-500">Nenhuma solicitação pendente.</p>
                                        </div>
                                    )}
                                </GlassCard>

                                <GlassCard title="Alunos Matriculados">
                                    {otherEnrollments.length > 0 ? (
                                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {otherEnrollments.map((enrollment) => (
                                                <li key={enrollment.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-gray-100">{enrollment.student.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{enrollment.student.email}</p>
                                                    </div>
                                                    <EnrollmentStatusBadge status={enrollment.status} />
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">Nenhum outro aluno encontrado.</p>
                                    )}
                                </GlassCard>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Order 1 on Mobile, Order 2 on Desktop) */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="sticky top-6 space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden -mt-12 lg:-mt-32 relative z-10">
                                <div className="h-48 w-full bg-gray-200 relative">
                                    <img src={course.image_url || course.cover_url || "https://placehold.co/600x400?text=Curso"} alt="Capa" className="w-full h-full object-cover"/>
                                </div>
                                <div className="p-6">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{course.title}</h3>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{course.code}</div>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </div>
                                    
                                    {isTeacher ? (
                                        <Link href={route('courses.edit', course.id)} className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-md transition-colors">
                                            Editar Configurações
                                        </Link>
                                    ) : (
                                        <button className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition-colors">
                                            Continuar Estudando
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Este curso inclui:</h4>
                                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                    <li className="flex items-center gap-3"><BookOpen size={16}/> <span>{course.modules?.length || 0} Módulos</span></li>
                                    <li className="flex items-center gap-3"><MessageSquare size={16}/> <span>Mural de avisos</span></li>
                                    <li className="flex items-center gap-3"><User size={16}/> <span>{course.enrollments?.length || 0} Alunos</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModuleFormModal 
                show={moduleModal.show} 
                onClose={() => setModuleModal({ show: false, module: null })} 
                module={moduleModal.module} 
                courseId={course.id} 
            />
            
            <ContentSelectModal 
                show={selectContentModal.show} 
                onClose={() => setSelectContentModal({ show: false, moduleId: null })} 
                moduleIndex={selectContentModal.moduleId} 
                onAttach={handleAttachContent} 
            />
        </AuthenticatedLayout>
    );
}