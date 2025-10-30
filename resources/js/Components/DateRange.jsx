import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

export default function DateRange({
    startName = "start_date",
    endName = "end_date",
    startValue,
    endValue,
    onChange,
    errors = {},
    labels = { start: "Data de Início", end: "Data de Fim" },
}) {
    return (
        <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <InputLabel htmlFor={startName} value={labels.start} />
                    <input
                        id={startName}
                        type="date"
                        value={startValue || ""}
                        onChange={(e) => onChange(startName, e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                    <InputError message={errors[startName]} />
                </div>
                <div className="space-y-1">
                    <InputLabel htmlFor={endName} value={labels.end} />
                    <input
                        id={endName}
                        type="date"
                        value={endValue || ""}
                        onChange={(e) => onChange(endName, e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                    <InputError message={errors[endName]} />
                </div>
            </div>
            {/* Progress bar between dates (visual enhancement) */}
            {startValue && endValue && (
                <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>{startValue}</span>
                        <span>{endValue}</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 dark:bg-indigo-400"
                            style={{ width: "100%" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
