import { Head, Link, usePage } from "@inertiajs/react";
import { BookOpen, TrendingUp, Eye, BarChart3, Users } from "lucide-react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import AppHeader from "@/Components/AppHeader";

// Componente inline: FeatureCard
function FeatureCard({
    icon: Icon,
    iconBg,
    iconColor,
    borderHover = "hover:border-blue-200 dark:hover:border-blue-600",
    title,
    description,
    bullets = [],
}) {
    return (
        <Card
            className={`group bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 ${borderHover}`}
        >
            <div
                className={`inline-flex items-center justify-center w-16 h-16 ${iconBg} rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
                {Icon && <Icon className={`h-8 w-8 ${iconColor}`} />}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-foreground mb-3">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-dark-muted-foreground mb-4">
                {description}
            </p>
            {!!bullets.length && (
                <ul className="text-sm text-gray-500 dark:text-dark-muted-foreground space-y-2 ml-2 text-left inline-block">
                    {bullets.map((b, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                            <div
                                className={`w-2 h-2 rounded-full ${b.dotColor}`}
                            ></div>
                            {b.text}
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}

export default function Welcome({ auth }) {
    const { props } = usePage();
    const { user } = auth;

    return (
        <>
            <Head title="Partner - Plataforma Educacional Inteligente" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-dark-background dark:to-blue-900">
                <AppHeader user={user} variant="public" />

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16">
                        <Tag className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 bg-blue-100 dark:bg-blue-darker text-blue-primary dark:text-white border-0">
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                <span>Múltiplas Perspectivas em Uma Só Plataforma</span>

                            </div>
                        </Tag>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-dark-foreground mb-6">
                            Seu Parceiro Inteligente na{" "}
                            <span className="text-blue-primary dark:text-blue-light">
                                Jornada Educacional
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-dark-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                            Uma plataforma integrada que oferece visões
                            personalizadas para estudantes, professores e
                            pesquisadores. Acompanhe métricas, receba
                            recomendações e tome decisões baseadas em dados
                            reais.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href={route("register")}>
                                <Button
                                    label="Começar Agora"
                                    className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold uppercase tracking-widest bg-blue-primary border-blue-primary hover:bg-blue-dark rounded-md"
                                />
                            </Link>
                            <Link href={route("login")}>
                                <Button
                                    label="Fazer Login"
                                    className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold uppercase tracking-widest bg-white border border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white dark:bg-dark-card dark:border-blue-primary dark:text-white dark:hover:bg-blue-primary rounded-md"
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Platform Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                        <FeatureCard
                            icon={BookOpen}
                            iconBg="bg-green-100 dark:bg-green-dark"
                            iconColor="text-green-success dark:text-green-success"
                            title="Para Estudantes"
                            description="Acompanhe seu progresso, receba recomendações personalizadas e visualize suas metas de aprendizagem."
                            borderHover="hover:border-green-dark dark:hover:border-green-success"
                            bullets={[
                                {
                                    text: "Metas de aprendizagem personalizadas",
                                    dotColor: "bg-green-success",
                                },
                                {
                                    text: "Comparação com desempenho da turma",
                                    dotColor: "bg-green-success",
                                },
                                {
                                    text: "Recomendações inteligentes de conteúdo",
                                    dotColor: "bg-green-success",
                                },
                            ]}
                        />
                        <FeatureCard
                            icon={BarChart3}
                            iconBg="bg-blue-100 dark:bg-blue-darker"
                            iconColor="text-blue-primary dark:text-blue-light"
                            title="Para Professores"
                            description="Tenha insights poderosos sobre o andamento das turmas e tome decisões pedagógicas baseadas em dados."
                            bullets={[
                                {
                                    text: "Dashboard analítico das turmas",
                                    dotColor: "bg-blue-primary",
                                },
                                {
                                    text: "Acompanhamento de engajamento",
                                    dotColor: "bg-blue-primary",
                                },
                                {
                                    text: "Ferramentas de intervenção pedagógica",
                                    dotColor: "bg-blue-primary",
                                },
                            ]}
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            iconBg="bg-purple-100 dark:bg-purple-dark"
                            iconColor="text-purple-light dark:text-purple-light"
                            borderHover="hover:border-purple-200 dark:hover:border-purple-light"
                            title="Para Pesquisadores"
                            description="Acesse dados educacionais para suas pesquisas e colabore em projetos acadêmicos."
                            bullets={[
                                {
                                    text: "Coleta de dados para pesquisa",
                                    dotColor: "bg-purple-light",
                                },
                                {
                                    text: "Análise de métricas educacionais",
                                    dotColor: "bg-purple-light",
                                },
                                {
                                    text: "Ferramentas de colaboração acadêmica",
                                    dotColor: "bg-purple-light",
                                },
                            ]}
                        />
                    </div>

                    {/* Unique Feature - Multi Perspective */}
                    <div className="mt-20 bg-gradient-to-r from-blue-primary to-purple-light rounded-2xl p-8 text-white shadow-2xl">
                        <div className="text-center max-w-3xl mx-auto">
                            <Tag className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-4 border-0">
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Funcionalidade Exclusiva
                            </div>

                            </Tag>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                                Múltiplas Perspectivas, Uma Só Conta
                            </h2>
                            <p className="text-blue-100 text-base sm:text-lg mb-6">
                                Se você é estudante, professor e pesquisador,
                                não precisa de contas separadas. Alterne entre
                                as visões específicas de cada papel através de
                                um simples seletor.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 text-sm">
                                <div className="flex items-center justify-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                                    <div className="w-3 h-3 bg-green-success rounded-full"></div>
                                    <span>Visão do Estudante</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                                    <div className="w-3 h-3 bg-blue-light rounded-full"></div>
                                    <span>Visão do Professor</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                                    <div className="w-3 h-3 bg-purple-light rounded-full"></div>
                                    <span>Visão do Pesquisador</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional CTA */}
                    <div className="mt-20 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-dark-foreground mb-4">
                            Pronto para Transformar sua Experiência Educacional?
                        </h2>
                        <p className="text-gray-600 dark:text-dark-muted-foreground mb-8 max-w-2xl mx-auto">
                            Junte-se a milhares de usuários que já estão
                            aproveitando os benefícios da nossa plataforma
                            inteligente.
                        </p>
                        <Link href={route("register")}>
                            <Button
                                label="Criar Minha Conta"
                                icon={<Users className="h-5 w-5 mr-2" />}
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-primary to-purple-light border border-transparent rounded-md font-semibold text-white uppercase tracking-widest hover:from-blue-dark hover:to-purple-dark focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-offset-2 transition ease-in-out duration-150 text-lg shadow-lg"
                            />
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}