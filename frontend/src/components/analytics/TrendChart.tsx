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
    data?: { name: string; emissions: number; date?: string }[];
}

// Format date for display on x-axis
const formatXAxisDate = (dateStr: string): string => {
    if (!dateStr) return "";

    // Handle ISO date strings like "2025-12-01T00:00:00+00:00"
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        // If not a valid date, return as-is (might already be formatted)
        return dateStr;
    }

    // Format as "Dec '25" for monthly data
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${month} '${year}`;
};

// Format date for tooltip
const formatTooltipDate = (dateStr: string): string => {
    if (!dateStr) return "";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return dateStr;
    }

    return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });
};

export function TrendChart({ data = [] }: TrendChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-neutral-400 text-sm">
                No trend data available
            </div>
        );
    }

    // Sort data by date
    const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.date || a.name);
        const dateB = new Date(b.date || b.name);
        return dateA.getTime() - dateB.getTime();
    });

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={sortedData}
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
                    tickFormatter={formatXAxisDate}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#737373', fontSize: 12 }}
                    tickFormatter={(value: number) => `${value.toFixed(0)}`}
                />
                <Tooltip
                    contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        backgroundColor: "white"
                    }}
                    cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                    labelFormatter={(label) => formatTooltipDate(label)}
                    formatter={(value: number) => [`${value.toLocaleString()} kg CO₂e`, 'Emissions']}
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
