interface EmitterData {
    dept_name: string;
    category: string;
    emissions: number;
    percent: number;
}

interface TopEmittersTableProps {
    data?: EmitterData[];
}

export function TopEmittersTable({ data = [] }: TopEmittersTableProps) {
    if (data.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-neutral-400 text-sm py-8">
                No emitter data available
            </div>
        );
    }

    return (
        <div className="w-full overflow-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3 font-medium">Department</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">CO₂e</th>
                        <th className="px-4 py-3 font-medium">% Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {data.map((item, index) => (
                        <tr key={index} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{item.dept_name}</td>
                            <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{item.category}</td>
                            <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 font-mono">
                                {item.emissions >= 1000
                                    ? `${(item.emissions / 1000).toFixed(1)}t`
                                    : `${item.emissions.toFixed(0)} kg`}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-neutral-500 dark:text-neutral-400 w-8 text-right">
                                        {item.percent.toFixed(0)}%
                                    </span>
                                    <div className="h-1.5 w-16 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full"
                                            style={{ width: `${Math.min(item.percent, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
