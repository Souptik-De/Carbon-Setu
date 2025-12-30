import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
    { name: "Electricity", value: 400, color: "#10b981" }, // emerald-500
    { name: "Transport", value: 300, color: "#3b82f6" },   // blue-500
    { name: "Waste", value: 300, color: "#f59e0b" },       // amber-500
    { name: "Heating", value: 200, color: "#ef4444" },     // red-500
];

export function CategoryChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    itemStyle={{ color: "#374151", fontWeight: 500 }}
                />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium ml-1">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
