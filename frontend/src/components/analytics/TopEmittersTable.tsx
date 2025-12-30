

const emitters = [
    { dept: "Manufacturing", category: "Electricity", co2: "450t", percent: "32%" },
    { dept: "Logistics", category: "Transport", co2: "320t", percent: "24%" },
    { dept: "Sales", category: "Travel", co2: "150t", percent: "11%" },
    { dept: "HQ Ops", category: "Heating", co2: "120t", percent: "8%" },
    { dept: "IT", category: "Servers", co2: "90t", percent: "6%" },
    { dept: "R&D", category: "Waste", co2: "50t", percent: "4%" },
];

export function TopEmittersTable() {
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
                    {emitters.map((item, index) => (
                        <tr key={index} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{item.dept}</td>
                            <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{item.category}</td>
                            <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 font-mono">{item.co2}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-neutral-500 dark:text-neutral-400 w-8 text-right">{item.percent}</span>
                                    <div className="h-1.5 w-16 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full"
                                            style={{ width: item.percent }}
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
