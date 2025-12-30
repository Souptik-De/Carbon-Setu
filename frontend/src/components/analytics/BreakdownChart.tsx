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

const data = [
    { name: "NY HQ", Electricity: 400, Transport: 240, Waste: 100 },
    { name: "London", Electricity: 300, Transport: 139, Waste: 80 },
    { name: "Mumbai", Electricity: 200, Transport: 980, Waste: 200 },
    { name: "Tokyo", Electricity: 278, Transport: 390, Waste: 150 },
    { name: "Sydney", Electricity: 189, Transport: 480, Waste: 120 },
];

export function BreakdownChart() {
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
                />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />
                <Bar dataKey="Electricity" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={20} />
                <Bar dataKey="Transport" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={20} />
                <Bar dataKey="Waste" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
        </ResponsiveContainer>
    );
}
