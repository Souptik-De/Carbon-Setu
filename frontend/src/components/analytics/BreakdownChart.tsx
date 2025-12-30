import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface BreakdownChartProps {
    data?: { name: string;[category: string]: string | number }[];
}

const COLORS = {
    Electricity: "#10b981",
    Transport: "#3b82f6",
    Waste: "#f59e0b",
    Gas: "#ef4444",
    Water: "#8b5cf6",
    Other: "#ec4899",
};

export function BreakdownChart({ data = [] }: BreakdownChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-neutral-400 text-sm">
                No breakdown data available
            </div>
        );
    }

    // Extract all unique category keys (excluding 'name')
    const categories = Array.from(
        new Set(
            data.flatMap((item) =>
                Object.keys(item).filter((key) => key !== "name" && typeof item[key] === "number")
            )
        )
    );

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                layout="vertical"
                margin={{
                    top: 0,
                    right: 30,
                    left: 40,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                <XAxis type="number" hide />
                <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#737373', fontSize: 12, fontWeight: 500 }}
                    width={80}
                />
                <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    cursor={{ fill: 'transparent' }}
                    formatter={(value: number) => [`${value.toLocaleString()} kg`, '']}
                />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />
                {categories.map((category, index) => (
                    <Bar
                        key={category}
                        dataKey={category}
                        stackId="a"
                        fill={COLORS[category as keyof typeof COLORS] || `hsl(${index * 60}, 70%, 50%)`}
                        radius={index === categories.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
                        barSize={20}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}
