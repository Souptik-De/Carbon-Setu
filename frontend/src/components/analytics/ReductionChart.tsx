import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

const data = [
    { name: "Switch to Renewables", potential: 350, difficulty: "Medium" },
    { name: "EV Fleet Transition", potential: 280, difficulty: "High" },
    { name: "HVAC Optimization", potential: 120, difficulty: "Low" },
    { name: "Waste Recycling", potential: 80, difficulty: "Low" },
    { name: "Remote Work Policy", potential: 200, difficulty: "Low" },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

export function ReductionChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                layout="vertical"
                margin={{
                    top: 5,
                    right: 30,
                    left: 40,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                <XAxis type="number" hide />
                <YAxis
                    dataKey="name"
                    type="category"
                    width={150}
                    tick={{ fontSize: 13, fill: '#525252', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    formatter={(value) => [`${value} tonnes`, 'Potential Reduction']}
                />
                <Bar dataKey="potential" radius={[0, 4, 4, 0]} barSize={24} name="Potential Reduction">
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
