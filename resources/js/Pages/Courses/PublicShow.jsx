import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { 
    ClipboardCopy, 
    Check, 
    ChevronRight, 
    PlayCircle, 
    FileText, 
    Link as LinkIcon, 
    Calendar, 
    User, 
    Clock, 
    BookOpen, 
    MessageSquare,
    AlertCircle,
    Share2
} from "lucide-react";

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

const ContentIcon = ({ type }) => {
    switch (type) {
        case 'video': return <PlayCircle size={16} className="text-blue-600" />;
        case 'pdf': 
        case 'document': return <FileText size={16} className="text-red-500" />;
        case 'link': return <LinkIcon size={16} className="text-gray-500" />;
        default: return <FileText size={16} className="text-gray-500" />;
    }
};

const EnrollmentActionCard = ({ course, enrollmentStatus }) => {
    const { flash } = usePage().props;
    const { post, processing } = useForm();

    const handleEnroll = () => {
        post(route("enrollments.store", course.id));
    };

    if (flash?.success) {
        return (
            <div className="p-4 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm text-center mb-4">
                {flash.success}
            </div>
        );
    }
    if (flash?.error) {
        return (
            <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm text-center mb-4">
                {flash.error}
            </div>
        );
    }

    if (enrollmentStatus?.status === 'pending') {
        return (
            <div className="space-y-3">
                <div className="w-full py-3 px-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-center font-medium flex flex-col items-center justify-center gap-2">
                    <Clock size={24} className="text-yellow-600"/>
                    <span>Solicitação enviada</span>
                </div>
                <p className="text-xs text-center text-gray-500">
                    Aguardando aprovação do professor.
                </p>
            </div>
        );
    }

    if (enrollmentStatus?.status === 'approved') {
        return (
            <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                        <Check size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-green-900">Você está matriculado!</p>
                        <p className="text-xs text-green-700">Bons estudos.</p>
                    </div>
                </div>
                
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Progresso</span>
                        <span>0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                </div>

                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition-colors shadow-sm">
                    Continuar de onde parou
                </button>
            </div>
        );
    }

    if (!course.accepts_enrollments) {
        return (
            <div className="w-full py-3 px-4 bg-gray-100 border border-gray-200 text-gray-500 rounded-md text-center font-medium cursor-not-allowed">
                Matrículas Encerradas
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <button
                onClick={handleEnroll}
                disabled={processing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-md transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {processing ? 'Processando...' : 'Solicitar Inscrição'}
            </button>
            <p className="text-xs text-center text-gray-500">
                Acesso imediato após aprovação.
            </p>
        </div>
    );
};

export default function PublicShow({ auth, course, enrollmentStatus }) {
    const [activeTab, setActiveTab] = useState('content');
    const isEnrolled = enrollmentStatus?.status === 'approved';
    const announcements = (course.contents || []).filter(c => c.type === "announcement");

    const [fromExplore, setFromExplore] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('origin') === 'explore') {
            setFromExplore(true);
        }
    }, []);

    const breadcrumbsItems = [
        { label: 'Home', href: route('dashboard') },
        ...(fromExplore ? [{ label: 'Explorar Cursos', href: route('courses.explore') }] : []),
        { label: course.title, href: null }
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', { 
            day: '2-digit', month: 'long', year: 'numeric' 
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={course.title} />

            <div className="bg-gray-900 text-white pt-8 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:w-2/3">
                        <Breadcrumbs items={breadcrumbsItems} />
                        
                        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
                            {course.title}
                        </h1>
                        
                        <p className="text-lg text-gray-300 mb-6 line-clamp-3">
                            {course.description}
                        </p>

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
                            <button 
                                onClick={() => setActiveTab('content')}
                                className={`pb-3 px-4 font-medium text-sm whitespace-nowrap ${activeTab === 'content' ? 'border-b-2 border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Conteúdo do Curso
                            </button>
                            <button 
                                onClick={() => setActiveTab('about')}
                                className={`pb-3 px-4 font-medium text-sm whitespace-nowrap ${activeTab === 'about' ? 'border-b-2 border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Sobre
                            </button>
                            {isEnrolled && (
                                <button 
                                    onClick={() => setActiveTab('announcements')}
                                    className={`pb-3 px-4 font-medium text-sm whitespace-nowrap ${activeTab === 'announcements' ? 'border-b-2 border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Mural de Avisos
                                </button>
                            )}
                        </div>

                        {activeTab === 'content' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-t-lg">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Grade Curricular</h3>
                                    <span className="text-xs text-gray-500">{course.modules?.length || 0} Módulos</span>
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
                                                    <span className="text-xs text-gray-500">
                                                        {module.contents?.length || 0} aulas
                                                    </span>
                                                </summary>
                                                <div className="text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/30 pb-2">
                                                    {module.contents && module.contents.map((content) => (
                                                        <div key={content.id} className="flex items-center justify-between py-2 px-4 pl-10 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                                            <Link 
                                                                href={isEnrolled || content.is_public ? route("contents.show", content.pivot?.id || content.id) : '#'}
                                                                className={`flex items-center gap-3 flex-1 group/link ${!isEnrolled && !content.is_public ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                <ContentIcon type={content.type} />
                                                                <span className={`text-sm text-gray-700 dark:text-gray-300 ${isEnrolled || content.is_public ? 'group-hover/link:text-indigo-600' : ''} transition-colors`}>
                                                                    {content.title}
                                                                </span>
                                                                {!content.is_public && !isEnrolled && (
                                                                    <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-500">Bloqueado</span>
                                                                )}
                                                            </Link>
                                                            {content.duration_minutes && (
                                                                <span className="text-xs text-gray-400">{content.duration_minutes} min</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {(!module.contents || module.contents.length === 0) && (
                                                        <div className="px-10 py-2 text-sm italic text-gray-400">Sem conteúdo.</div>
                                                    )}
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        Conteúdo programático indisponível.
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Sobre este curso</h3>
                                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {course.description}
                                </div>
                            </div>
                        )}

                        {activeTab === 'announcements' && isEnrolled && (
                            <div className="space-y-4">
                                {announcements.length > 0 ? (
                                    announcements.map((content) => (
                                        <div key={content.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
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
                                            {content.tags && content.tags.length > 0 && (
                                                <div className="mt-3 flex gap-2">
                                                    {content.tags.map(tag => (
                                                        <span key={tag.id} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                                            #{tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        Nenhum aviso no mural.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden -mt-32 relative z-10">
                                <div className="h-48 w-full bg-gray-200 relative group">
                                    <img 
                                        src={course.image_url || course.cover_url || "https://placehold.co/600x400?text=Curso"} 
                                        alt="Capa" 
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                
                                <div className="p-6">
                                    <EnrollmentActionCard course={course} enrollmentStatus={enrollmentStatus} />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Este curso inclui:</h4>
                                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                    <li className="flex items-center gap-3">
                                        <BookOpen size={16} className="text-gray-400" />
                                        <span>{course.modules?.length || 0} Módulos de aula</span>
                                    </li>
                                    <li className="flex items-center gap-3"><MessageSquare size={16}/> <span>Mural de avisos</span></li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}