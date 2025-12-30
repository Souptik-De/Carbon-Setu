import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";

interface TrendChartProps {
    data?: { name: string; emissions: number }[];
}

export function TrendChart({ data = [] }: TrendChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-neutral-400 text-sm">
                No trend data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#737373', fontSize: 12 }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#737373', fontSize: 12 }}
                />
                <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                    type="monotone"
                    dataKey="emissions"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorEmissions)"
                    activeDot={{ r: 6, strokeWidth: 0 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
