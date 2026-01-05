import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { Calendar } from "primereact/calendar";

export default function DateRange({
    startName = "start_date",
    endName = "end_date",
    startValue,
    endValue,
    onChange,
    errors = {},
    labels = { start: "Data de Início", end: "Data de Término" },
    className = "",
}) {
    const formatDateForInput = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString);
    };

    const handleDateChange = (field, value) => {
        // Formata a data para YYYY-MM-DD antes de enviar
        const formattedDate = value ? value.toISOString().split("T")[0] : "";
        onChange(field, formattedDate);
    };

    const getMinEndDate = () => {
        return startValue ? new Date(startValue) : undefined;
    };

    const getMaxStartDate = () => {
        return endValue ? new Date(endValue) : undefined;
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Data de Início */}
                <div className="space-y-3">
                    <InputLabel
                        htmlFor={startName}
                        value={labels.start}
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    />
                    <div className="relative">
                        <Calendar
                            id={startName}
                            value={formatDateForInput(startValue)}
                            onChange={(e) =>
                                handleDateChange(startName, e.value)
                            }
                            dateFormat="dd/mm/yy"
                            placeholder="Selecione a data"
                            showIcon
                            icon="pi pi-calendar"
                            maxDate={getMaxStartDate()}
                            className="w-full"
                            inputClassName="w-full py-3 px-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            panelClassName="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl"
                        />
                    </div>
                    <InputError message={errors[startName]} />
                </div>

                {/* Data de Término */}
                <div className="space-y-3">
                    <InputLabel
                        htmlFor={endName}
                        value={labels.end}
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    />
                    <div className="relative">
                        <Calendar
                            id={endName}
                            value={formatDateForInput(endValue)}
                            onChange={(e) => handleDateChange(endName, e.value)}
                            dateFormat="dd/mm/yy"
                            placeholder="Selecione a data"
                            showIcon
                            icon="pi pi-calendar"
                            minDate={getMinEndDate()}
                            className="w-full"
                            inputClassName="w-full py-3 px-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            panelClassName="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl"
                        />
                    </div>
                    <InputError message={errors[endName]} />
                </div>
            </div>

            {/* Visualização do período */}
            {(startValue || endValue) && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-primary/5 to-purple-light/5 rounded-xl border border-blue-primary/20">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-primary rounded-full"></div>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                                Período do Curso:
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                            {startValue && (
                                <span className="font-medium">
                                    {new Date(startValue).toLocaleDateString(
                                        "pt-BR"
                                    )}
                                </span>
                            )}
                            {startValue && endValue && (
                                <span className="text-gray-400">→</span>
                            )}
                            {endValue && (
                                <span className="font-medium">
                                    {new Date(endValue).toLocaleDateString(
                                        "pt-BR"
                                    )}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Barra de progresso visual */}
                    {startValue && endValue && (
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                                <span>Início</span>
                                <span>Término</span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-primary to-purple-light rounded-full"
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Mensagem quando apenas uma data está selecionada */}
            {startValue && !endValue && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        ⚠️ Selecione a data de término para completar o período
                        do curso.
                    </p>
                </div>
            )}
        </div>
    );
}
