import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import GlassCard from "@/Components/GlassCard";
import { useState, useEffect } from "react";
import { 
    ClipboardCopy, ClipboardCheck, Check, X, ChevronRight, 
    PlayCircle, FileText, Link as LinkIcon, Calendar, User, Clock, 
    BookOpen, MessageSquare, Plus, Edit2, Trash2 
} from "lucide-react";
import InputLabel from '@/Components/InputLabel';
import TagInput from '@/Components/TagInput'; 
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';

const ModuleFormModal = ({ show, onClose, module = null, courseId }) => {
    const isEditing = !!module;
    const { data, setData, post, patch, processing, reset, errors } = useForm({
        title: module?.title || '',
        description: module?.description || '',
    });

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
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    {isEditing ? 'Editar Módulo' : 'Novo Módulo'}
                </h2>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel value="Título" />
                        <TextInput 
                            value={data.title} 
                            onChange={e => setData('title', e.target.value)} 
                            className="w-full mt-1" 
                            autoFocus
                        />
                        <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                    </div>
                    <div>
                        <InputLabel value="Descrição (Opcional)" />
                        <TextInput 
                            value={data.description} 
                            onChange={e => setData('description', e.target.value)} 
                            className="w-full mt-1" 
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">Cancelar</button>
                        <PrimaryButton disabled={processing}>Salvar</PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

const ContentFormModal = ({ show, onClose, moduleId, content = null }) => {
    const isEditing = !!content;
    const { data, setData, post, patch, processing, reset, errors } = useForm({
        title: content?.title || '',
        type: content?.type || 'video',
        url: content?.url || '',
        content: content?.content || '',
        file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(route('contents.update', content.id), { onSuccess: () => { reset(); onClose(); } });
        } else {
            post(route('modules.contents.store', moduleId), { 
                onSuccess: () => { reset(); onClose(); }, 
                forceFormData: true 
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    {isEditing ? 'Editar Conteúdo' : 'Adicionar Conteúdo'}
                </h2>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Tipo" />
                            <select 
                                value={data.type} 
                                onChange={e => setData('type', e.target.value)}
                                disabled={isEditing}
                                className="w-full mt-1 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                            >
                                <option value="video">Vídeo</option>
                                <option value="pdf">PDF</option>
                                <option value="link">Link Externo</option>
                                <option value="text">Texto</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel value="Título" />
                            <TextInput value={data.title} onChange={e => setData('title', e.target.value)} className="w-full mt-1" />
                            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                        </div>
                    </div>

                    {data.type === 'link' && (
                        <div>
                            <InputLabel value="URL" />
                            <TextInput value={data.url} onChange={e => setData('url', e.target.value)} className="w-full mt-1" placeholder="https://" />
                            <p className="text-red-500 text-xs mt-1">{errors.url}</p>
                        </div>
                    )}
                    {data.type === 'text' && (
                        <div>
                            <InputLabel value="Conteúdo" />
                            <textarea 
                                value={data.content} 
                                onChange={e => setData('content', e.target.value)} 
                                className="w-full mt-1 rounded-md border-gray-300 dark:bg-gray-900" 
                                rows="4"
                            />
                        </div>
                    )}
                    {['video', 'pdf'].includes(data.type) && !isEditing && (
                        <div>
                            <InputLabel value="Arquivo" />
                            <input type="file" onChange={e => setData('file', e.target.files[0])} className="block w-full text-sm text-gray-500 mt-1" />
                            <p className="text-red-500 text-xs mt-1">{errors.file}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">Cancelar</button>
                        <PrimaryButton disabled={processing}>Salvar</PrimaryButton>
                    </div>
                </form>
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
    const [contentModal, setContentModal] = useState({ show: false, moduleId: null, content: null });

    const isTeacher = auth.user.id === course.teacher_id;
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
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {}
    };

    const breadcrumbsItems = [
        { label: 'Home', href: route('dashboard') },
        ...(fromExplore ? [{ label: 'Explorar Cursos', href: route('courses.explore') }] : []),
        { label: course.title, href: null }
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={course.title} />

            <div className="bg-gray-900 text-white pt-8 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:w-2/3">
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="lg:col-span-2 space-y-8">
                        
                        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
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
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-t-lg">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Grade Curricular</h3>
                                        <span className="text-xs text-gray-500">({course.modules?.length || 0})</span>
                                    </div>
                                    {isTeacher && (
                                        <button 
                                            onClick={() => setModuleModal({ show: true, module: null })}
                                            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1"
                                        >
                                            <Plus size={14} /> Novo Módulo
                                        </button>
                                    )}
                                </div>
                                
                                {course.modules && course.modules.length > 0 ? (
                                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {course.modules.map((module, idx) => (
                                            <details key={module.id} className="group" open={idx === 0}>
                                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <ChevronRight className="transition-transform group-open:rotate-90 text-gray-400" size={18} />
                                                        <span className="text-gray-900 dark:text-gray-100">{module.title}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-gray-500">{module.contents?.length || 0} aulas</span>
                                                        {isTeacher && (
                                                            <div className="flex items-center gap-1" onClick={e => e.preventDefault()}>
                                                                <button onClick={() => setContentModal({ show: true, moduleId: module.id, content: null })} className="p-1.5 text-green-600 hover:bg-green-100 rounded" title="Add Aula"><Plus size={14} /></button>
                                                                <button onClick={() => setModuleModal({ show: true, module })} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded" title="Editar"><Edit2 size={14} /></button>
                                                                <button onClick={() => deleteModule(module.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded" title="Excluir"><Trash2 size={14} /></button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </summary>
                                                <div className="text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/30 pb-2">
                                                    {module.contents && module.contents.map((content) => (
                                                        <div key={content.id} className="flex items-center justify-between py-2 px-4 pl-10 hover:bg-gray-100 dark:hover:bg-gray-700/50 group/item">
                                                            <Link 
                                                                href={route("contents.show", content.pivot?.id || content.id)}
                                                                className="flex items-center gap-3 flex-1 group/link"
                                                            >
                                                                <ContentIcon type={content.type} />
                                                                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover/link:text-indigo-600 transition-colors">
                                                                    {content.title}
                                                                </span>
                                                            </Link>
                                                            {isTeacher && (
                                                                <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                                    <button onClick={() => setContentModal({ show: true, moduleId: module.id, content })} className="p-1 text-gray-400 hover:text-blue-600"><Edit2 size={14} /></button>
                                                                    <button onClick={() => deleteContent(module.id, content.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {(!module.contents || module.contents.length === 0) && (
                                                        <div className="px-10 py-3 text-sm italic text-gray-400 text-center">Este módulo está vazio.</div>
                                                    )}
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        Nenhum módulo criado. {isTeacher && "Clique em 'Novo Módulo' para começar."}
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
                                            <button onClick={handleCopyCode} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium">
                                                {copied ? <Check size={16}/> : <ClipboardCopy size={16}/>} {copied ? 'Copiado' : 'Copiar'}
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
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'manage' && isTeacher && (
                            <GlassCard title="Solicitações Pendentes">
                                {pendingEnrollments.length > 0 ? (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {pendingEnrollments.map(enrollment => (
                                            <div key={enrollment.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{enrollment.student.name}</p>
                                                    <p className="text-xs text-gray-500">{enrollment.student.email}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link as="button" href={route("enrollments.approve", enrollment.id)} method="post" className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"><Check size={18}/></Link>
                                                    <Link as="button" href={route("enrollments.reject", enrollment.id)} method="post" className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"><X size={18}/></Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-gray-500 text-center py-4">Nenhuma solicitação pendente.</p>}
                            </GlassCard>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden -mt-32 relative z-10">
                                <div className="h-48 w-full bg-gray-200 relative">
                                    <img src={course.image_url || course.cover_url || "https://placehold.co/600x400?text=Curso"} alt="Capa" className="w-full h-full object-cover"/>
                                </div>
                                <div className="p-6">
                                    {isTeacher ? (
                                        <Link href={route('courses.edit', course.id)} className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-md">
                                            Editar Configurações
                                        </Link>
                                    ) : (
                                        <button className="block w-full bg-green-600 text-white font-bold py-3 rounded-md">
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
            <ContentFormModal 
                show={contentModal.show} 
                onClose={() => setContentModal({ show: false, moduleId: null, content: null })} 
                moduleId={contentModal.moduleId} 
                content={contentModal.content} 
            />
        </AuthenticatedLayout>
    );
}