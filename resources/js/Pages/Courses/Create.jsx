import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GlassCard from "@/Components/GlassCard";
import ImageUpload from "@/Components/ImageUpload";
import DateRange from "@/Components/DateRange";
import ContentSelectModal from "@/Components/ContentSelectModal";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";
import { 
    Plus, 
    Trash2, 
    FileText, 
    Video, 
    Link2, 
    Calendar,
    BookOpen,
    ArrowLeft,
    Settings
} from "lucide-react";

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        image: null,
        modules: [],
    });
    const [showContentModal, setShowContentModal] = useState(false);
    const [activeModuleIndex, setActiveModuleIndex] = useState(null);

    const addModule = () => {
        setData("modules", [
            ...data.modules,
            { title: "", description: "", contents: [] },
        ]);
    };

    const updateModuleField = (index, field, value) => {
        const modules = [...data.modules];
        modules[index][field] = value;
        setData("modules", modules);
    };

    const removeModule = (index) => {
        const modules = [...data.modules];
        modules.splice(index, 1);
        setData("modules", modules);
        if (activeModuleIndex === index) {
            setShowContentModal(false);
            setActiveModuleIndex(null);
        }
    };

    const confirmRemoveModule = (index) => {
        if (window.confirm("Remover este módulo? Esta ação não pode ser desfeita.")) {
            removeModule(index);
        }
    };

    const attachContentToModule = (content) => {
        const modules = [...data.modules];
        modules[activeModuleIndex].contents.push(content);
        setData("modules", modules);
    };

    const openContentModal = (index) => {
        setActiveModuleIndex(index);
        setShowContentModal(true);
    };

    const getContentIcon = (type) => {
        switch (type) {
            case 'video': return <Video className="h-3 w-3" />;
            case 'link': return <Link2 className="h-3 w-3" />;
            case 'file': return <FileText className="h-3 w-3" />;
            default: return <FileText className="h-3 w-3" />;
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("start_date", data.start_date);
        formData.append("end_date", data.end_date);
        if (data.image) formData.append("image", data.image);
        
        data.modules.forEach((m, mi) => {
            formData.append(`modules[${mi}][title]`, m.title);
            formData.append(`modules[${mi}][description]`, m.description || "");
            m.contents.forEach((c, ci) => {
                formData.append(`modules[${mi}][contents][${ci}][title]`, c.title);
                formData.append(`modules[${mi}][contents][${ci}][type]`, c.type);
                if (c.is_public) formData.append(`modules[${mi}][contents][${ci}][is_public]`, c.is_public ? 1 : 0);
                if (c.id) formData.append(`modules[${mi}][contents][${ci}][id]`, c.id);
                if (c.file) formData.append(`modules[${mi}][contents][${ci}][file]`, c.file);
                if (c.url) formData.append(`modules[${mi}][contents][${ci}][url]`, c.url);
                if (c.content) formData.append(`modules[${mi}][contents][${ci}][content]`, c.content);
                if (c.description) formData.append(`modules[${mi}][contents][${ci}][description]`, c.description);
            });
        });
        
        post(route("courses.store"), { data: formData, forceFormData: true });
    };

    return (
        <>
            <AuthenticatedLayout user={auth.user}>
                <Head title="Criar Curso" />

                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-dark-background dark:to-blue-900 py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header moderno */}
                        <div className="mb-8">
                            <Link
                                href={route("dashboard")}
                                className="inline-flex items-center gap-2 text-blue-primary hover:text-blue-dark dark:text-blue-light dark:hover:text-blue-primary mb-4 transition-colors group"
                            >
                                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                Voltar para o Dashboard
                            </Link>
                            
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-gradient-to-r from-blue-primary to-purple-light rounded-xl shadow-lg">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        Criar Novo Curso
                                    </h1>
                                    <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
                                        Construa uma experiência de aprendizado incrível
                                    </p>
                                </div>
                            </div>
                        </div>

                        <GlassCard className="p-8">
                            <form onSubmit={submit} className="space-y-8" encType="multipart/form-data">
                                {/* Seção de Imagem */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-primary/10 rounded-lg">
                                            <Settings className="h-5 w-5 text-blue-primary" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Imagem do Curso
                                        </h2>
                                    </div>
                                    <ImageUpload
                                        label="Imagem de Capa"
                                        name="image"
                                        value={data.image}
                                        onChange={(file) => setData("image", file)}
                                        error={errors.image}
                                        helper="Esta imagem aparecerá como miniatura nas listagens. Recomendado: 1280x720px"
                                    />
                                </div>

                                {/* Informações Básicas */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-success/10 rounded-lg">
                                            <FileText className="h-5 w-5 text-green-success" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Informações Básicas
                                        </h2>
                                    </div>

                                    {/* Título */}
                                    <div className="space-y-3">
                                        <InputLabel
                                            htmlFor="title"
                                            value="Título do Curso *"
                                            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                                        />
                                        <TextInput
                                            id="title"
                                            name="title"
                                            value={data.title}
                                            className="w-full text-lg py-3 px-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 transition-colors"
                                            autoComplete="title"
                                            isFocused={true}
                                            onChange={(e) => setData("title", e.target.value)}
                                            required
                                            placeholder="Ex: Desenvolvimento Web com React"
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    {/* Descrição */}
                                    <div className="space-y-3">
                                        <InputLabel
                                            htmlFor="description"
                                            value="Descrição do Curso"
                                            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                                        />
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            className="w-full min-h-[120px] py-3 px-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                                            onChange={(e) => setData("description", e.target.value)}
                                            placeholder="Descreva o que os alunos irão aprender neste curso..."
                                        />
                                        <InputError message={errors.description} />
                                    </div>
                                </div>

                                {/* Datas */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-light/10 rounded-lg">
                                            <Calendar className="h-5 w-5 text-purple-light" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Período do Curso
                                        </h2>
                                    </div>
                                    <DateRange
                                        startValue={data.start_date}
                                        endValue={data.end_date}
                                        onChange={(field, value) => setData(field, value)}
                                        errors={errors}
                                    />
                                </div>

                                {/* Módulos do Curso */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                                <BookOpen className="h-5 w-5 text-orange-500" />
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                Estrutura do Curso
                                            </h2>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addModule}
                                            className="inline-flex items-center gap-2 px-4 py-3 bg-blue-primary hover:bg-blue-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Adicionar Módulo
                                        </button>
                                    </div>

                                    {data.modules.length === 0 ? (
                                        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30">
                                            <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                                Nenhum módulo adicionado
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                                                Comece adicionando módulos para organizar o conteúdo do seu curso.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {data.modules.map((m, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative border-2 border-gray-200 dark:border-gray-600 rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
                                                >
                                                    {/* Header do Módulo */}
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center justify-center w-8 h-8 bg-blue-primary text-white rounded-lg font-semibold text-sm">
                                                                {idx + 1}
                                                            </div>
                                                            <div>
                                                                <input
                                                                    value={m.title}
                                                                    onChange={(e) => updateModuleField(idx, "title", e.target.value)}
                                                                    className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 w-full"
                                                                    placeholder={`Módulo ${idx + 1}`}
                                                                />
                                                                <input
                                                                    value={m.description}
                                                                    onChange={(e) => updateModuleField(idx, "description", e.target.value)}
                                                                    className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-600 dark:text-gray-400 placeholder-gray-400 w-full mt-1"
                                                                    placeholder="Descrição breve do módulo..."
                                                                />
                                                            </div>
                                                        </div>
                                                        
                                                        <button
                                                            type="button"
                                                            onClick={() => confirmRemoveModule(idx)}
                                                            className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    {/* Conteúdos do Módulo */}
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                                                Conteúdos ({m.contents.length})
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => openContentModal(idx)}
                                                                className="inline-flex items-center gap-2 px-3 py-2 bg-green-success hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                                Adicionar Conteúdo
                                                            </button>
                                                        </div>
                                                        
                                                        {m.contents.length === 0 ? (
                                                            <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-700/30">
                                                                <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    Nenhum conteúdo adicionado
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="grid gap-2">
                                                                {m.contents.map((c, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            {getContentIcon(c.type)}
                                                                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                                                                                {c.title}
                                                                            </span>
                                                                        </div>
                                                                        <span className="px-2 py-1 bg-blue-primary/10 text-blue-primary dark:text-blue-light text-xs font-semibold rounded-md uppercase">
                                                                            {c.type}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Botões de Ação */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
                                    <Link
                                        href={route("dashboard")}
                                        className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-semibold rounded-xl transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Cancelar
                                    </Link>
                                    <PrimaryButton 
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-primary to-purple-light hover:from-blue-dark hover:to-purple-dark"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Criando...
                                            </>
                                        ) : (
                                            <>
                                                <BookOpen className="h-5 w-5" />
                                                Criar Curso
                                            </>
                                        )}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </GlassCard>
                    </div>
                </div>
            </AuthenticatedLayout>
            
            <ContentSelectModal
                show={showContentModal}
                onClose={() => setShowContentModal(false)}
                moduleIndex={activeModuleIndex}
                onAttach={attachContentToModule}
            />
        </>
    );
}