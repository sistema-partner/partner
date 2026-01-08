import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";

export default function Settings({ auth, course }) {
    const { data, setData, post, processing, errors } = useForm({
        status: course.status,
        visibility: course.visibility,
        enrollment_policy: course.enrollment_policy,
        accepts_enrollments: course.accepts_enrollments,
        max_students: course.max_students ?? null,
        start_date: course.start_date ? new Date(course.start_date) : null,
        end_date: course.end_date ? new Date(course.end_date) : null,
    });

    function submit(e) {
        e.preventDefault();

        post(route("teacher.courses.settings.update", course.id), {
            status: data.status,
            visibility: data.visibility,
            enrollment_policy: data.enrollment_policy,
            accepts_enrollments: data.accepts_enrollments,
            max_students: data.max_students,
            start_date: data.start_date
                ? data.start_date.toISOString().split("T")[0]
                : null,
            end_date: data.end_date
                ? data.end_date.toISOString().split("T")[0]
                : null,
            _method: "PUT",
        });
    }

    const visibilityOptions = [
        {
            label: "Público",
            value: "public",
            description: "Visível para todos",
        },
        {
            label: "Não listado",
            value: "unlisted",
            description: "Acesso apenas com link",
        },
        {
            label: "Privado",
            value: "private",
            description: "Apenas convidados",
        },
    ];

    const enrollmentOptions = [
        {
            label: "Aprovação manual",
            value: "manual_approval",
            description: "Você aprova cada matrícula",
        },
        {
            label: "Aprovação automática",
            value: "auto_approve",
            description: "Alunos entram automaticamente",
        },
        {
            label: "Matrículas fechadas",
            value: "closed",
            description: "Nenhuma nova matrícula",
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Configurações do curso" />

            <div className="max-w-3xl mx-auto py-10">
                {/* Cabeçalho */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                        <i className="pi pi-cog text-3xl text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Configurações
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Defina como os alunos podem acessar este curso
                    </p>
                </div>

                <Card className="shadow-lg border-0">
                    <form onSubmit={submit} className="">
                        {/* Seção de Acesso */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                    <i className="pi pi-eye text-blue-600 dark:text-blue-400"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        Acesso e Visibilidade
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Controle quem pode ver e acessar este
                                        curso
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <FloatLabel>
                                        <Dropdown
                                            id="visibility"
                                            value={data.visibility}
                                            onChange={(e) =>
                                                setData("visibility", e.value)
                                            }
                                            options={visibilityOptions}
                                            optionLabel="label"
                                            placeholder=" "
                                            className={`w-full ${
                                                errors.visibility
                                                    ? "p-invalid"
                                                    : ""
                                            }`}
                                            pt={{
                                                root: {
                                                    className:
                                                        "w-full border border-light-border dark:border-dark-border rounded-lg bg-light-card dark:bg-dark-card",
                                                },
                                                input: {
                                                    className:
                                                        "text-light-foreground dark:text-dark-foreground",
                                                },
                                            }}
                                        />
                                        <label
                                            htmlFor="visibility"
                                            className="text-gray-700 dark:text-gray-300"
                                        >
                                            Visibilidade *
                                        </label>
                                    </FloatLabel>
                                    {data.visibility && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {
                                                visibilityOptions.find(
                                                    (opt) =>
                                                        opt.value ===
                                                        data.visibility
                                                )?.description
                                            }
                                        </p>
                                    )}
                                    <InputError message={errors.visibility} />
                                </div>

                                <div className="space-y-2">
                                    <FloatLabel>
                                        <Dropdown
                                            id="enrollment_policy"
                                            value={data.enrollment_policy}
                                            onChange={(e) =>
                                                setData(
                                                    "enrollment_policy",
                                                    e.value
                                                )
                                            }
                                            options={enrollmentOptions}
                                            optionLabel="label"
                                            placeholder=" "
                                            className={`w-full ${
                                                errors.enrollment_policy
                                                    ? "p-invalid"
                                                    : ""
                                            }`}
                                            pt={{
                                                root: {
                                                    className:
                                                        "w-full border border-light-border dark:border-dark-border rounded-lg bg-light-card dark:bg-dark-card",
                                                },
                                                input: {
                                                    className:
                                                        "text-light-foreground dark:text-dark-foreground",
                                                },
                                            }}
                                        />
                                        <label
                                            htmlFor="enrollment_policy"
                                            className="text-gray-700 dark:text-gray-300"
                                        >
                                            Política de matrícula *
                                        </label>
                                    </FloatLabel>
                                    {data.enrollment_policy && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {
                                                enrollmentOptions.find(
                                                    (opt) =>
                                                        opt.value ===
                                                        data.enrollment_policy
                                                )?.description
                                            }
                                        </p>
                                    )}
                                    <InputError
                                        message={errors.enrollment_policy}
                                    />
                                </div>
                            </div>
                        </div>

                        <Divider />

                        {/* Seção de Limites */}
                        <div className="w-full">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                                    <i className="pi pi-users text-purple-600 dark:text-purple-400"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        Limites e Capacidade
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Configure limites para o curso
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 max-w-xs">
                                <FloatLabel>
                                    <InputNumber
                                        id="max_students"
                                        value={data.max_students}
                                        onValueChange={(e) =>
                                            setData("max_students", e.value)
                                        }
                                        mode="decimal"
                                        showButtons
                                        min={0}
                                        className={`w-full ${
                                            errors.max_students
                                                ? "p-invalid"
                                                : ""
                                        }`}
                                        pt={{
                                            root: {
                                                className:
                                                    "w-full border dark:border-dark-border rounded-lg bg-light-card dark:bg-dark-card",
                                            },
                                            input: {
                                                className:
                                                    "text-light-foreground dark:text-dark-foreground",
                                            },
                                        }}
                                    />
                                    <label
                                        htmlFor="max_students"
                                        className="text-gray-700 dark:text-gray-300"
                                    >
                                        Máximo de alunos (opcional)
                                    </label>
                                </FloatLabel>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Deixe em branco para ilimitado
                                </p>
                                <InputError message={errors.max_students} />
                            </div>
                        </div>

                        <Divider />

                        {/* Seção de Datas */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                                    <i className="pi pi-calendar text-green-600 dark:text-green-400"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        Datas do Curso
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Defina o período de duração
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <FloatLabel>
                                        <Calendar
                                            id="start_date"
                                            value={data.start_date}
                                            onChange={(e) =>
                                                setData("start_date", e.value)
                                            }
                                            dateFormat="dd/mm/yy"
                                            showIcon
                                            icon="pi pi-calendar"
                                            placeholder=" "
                                            className={`w-full ${
                                                errors.start_date
                                                    ? "p-invalid"
                                                    : ""
                                            }`}
                                            pt={{
                                                root: {
                                                    className:
                                                        "w-full border border-light-border dark:border-dark-border rounded-lg bg-light-card dark:bg-dark-card",
                                                },
                                                input: {
                                                    className:
                                                        "text-light-foreground dark:text-dark-foreground",
                                                },
                                            }}
                                        />
                                        <label
                                            htmlFor="start_date"
                                            className="text-gray-700 dark:text-gray-300"
                                        >
                                            Data de início
                                        </label>
                                    </FloatLabel>
                                    <InputError message={errors.start_date} />
                                </div>

                                <div className="space-y-4">
                                    <FloatLabel>
                                        <Calendar
                                            id="end_date"
                                            value={data.end_date}
                                            onChange={(e) =>
                                                setData("end_date", e.value)
                                            }
                                            dateFormat="dd/mm/yy"
                                            showIcon
                                            icon="pi pi-calendar"
                                            placeholder=" "
                                            className={`w-full ${
                                                errors.end_date
                                                    ? "p-invalid"
                                                    : ""
                                            }`}
                                            pt={{
                                                root: {
                                                    className:
                                                        "w-full border border-light-border dark:border-dark-border rounded-lg bg-light-card dark:bg-dark-card",
                                                },
                                                input: {
                                                    className:
                                                        "text-light-foreground dark:text-dark-foreground",
                                                },
                                            }}
                                        />
                                        <label
                                            htmlFor="end_date"
                                            className="text-gray-700 dark:text-gray-300"
                                        >
                                            Data de término
                                        </label>
                                    </FloatLabel>
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-light-border dark:border-dark-border mt-8">
                            <Link
                                href={route("teacher.courses.about", course.id)}
                                className="px-6 py-3 rounded-lg border border-light-border dark:border-dark-border text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2"
                            >
                                <i className="pi pi-arrow-left"></i>
                                Voltar
                            </Link>

                            <PrimaryButton
                                disabled={processing}
                                className="px-8 py-3 rounded-lg flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <i className="pi pi-spin pi-spinner"></i>
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <i className="pi pi-check"></i>
                                        Salvar e continuar
                                    </>
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
