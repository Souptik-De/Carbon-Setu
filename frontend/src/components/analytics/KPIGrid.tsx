import {
    TrendingDown,
    TrendingUp,
    AlertCircle,
    Zap,
    Leaf
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KPIGrid() {
    // Mock data - replace with real props later
    const metrics = [
        {
            title: "Total CO₂e",
            value: "1,245 tonnes",
            change: "-12.5%",
            trend: "down", // down is good for emissions
            icon: Leaf,
            description: "vs. last month"
        },
        {
            title: "Avg. Daily Emissions",
            value: "41.5 tonnes",
            change: "+2.1%",
            trend: "up",
            icon: Zap,
            description: "vs. last month"
        },
        {
            title: "Top Category",
            value: "Electricity",
            change: "45%",
            trend: "neutral",
            icon: AlertCircle,
            description: "of total emissions"
        },
        {
            title: "Highest Emitting Dept",
            value: "Manufacturing",
            change: "850t",
            trend: "neutral",
            icon: TrendingUp,
            description: "contribution"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
                <Card key={index} className="backdrop-blur-sm bg-white/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                            {metric.title}
                        </CardTitle>
                        <metric.icon className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{metric.value}</div>
                        <p className="text-xs flex items-center mt-1">
                            <span
                                className={`flex items-center font-medium ${metric.trend === "down"
                                    ? "text-emerald-500"
                                    : metric.trend === "up"
                                        ? "text-rose-500"
                                        : "text-neutral-500"
                                    }`}
                            >
                                {metric.trend === "down" && <TrendingDown className="mr-1 h-3 w-3" />}
                                {metric.trend === "up" && <TrendingUp className="mr-1 h-3 w-3" />}
                                {metric.change}
                            </span>
                            <span className="ml-1 text-neutral-400">{metric.description}</span>
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
