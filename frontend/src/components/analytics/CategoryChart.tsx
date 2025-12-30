import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CategoryChartProps {
    data?: { name: string; value: number; color?: string }[];
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function CategoryChart({ data = [] }: CategoryChartProps) {
    const chartData = data.map((item, index) => ({
        ...item,
        color: item.color || COLORS[index % COLORS.length]
    }));

    if (chartData.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-neutral-400 text-sm">
                No category data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    itemStyle={{ color: "#374151", fontWeight: 500 }}
                    formatter={(value: number) => [`${value} kg`, 'Emissions']}
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
