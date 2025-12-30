import {
    TrendingDown,
    TrendingUp,
    AlertCircle,
    Zap,
    Leaf,
    Building2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryData {
    name: string;
    value: number;
}

interface DepartmentData {
    dept_id: string;
    dept_name: string;
    total_emissions: number;
}

interface KPIGridProps {
    totalEmissions: number;
    categoryData?: CategoryData[];
    departmentData?: DepartmentData[];
}

export function KPIGrid({ totalEmissions, categoryData = [], departmentData = [] }: KPIGridProps) {
    // Calculate top category
    const topCategory = categoryData.length > 0
        ? categoryData.reduce((prev, curr) => (curr.value > prev.value ? curr : prev), categoryData[0])
        : null;

    // Calculate highest emitting department
    const topDepartment = departmentData.length > 0
        ? departmentData.reduce((prev, curr) => (curr.total_emissions > prev.total_emissions ? curr : prev), departmentData[0])
        : null;

    // Calculate percentage for top category
    const topCategoryPercent = topCategory && totalEmissions > 0
        ? ((topCategory.value / totalEmissions) * 100).toFixed(1)
        : null;

    // Calculate percentage for top department
    const topDeptPercent = topDepartment && totalEmissions > 0
        ? ((topDepartment.total_emissions / totalEmissions) * 100).toFixed(1)
        : null;

    const metrics = [
        {
            title: "Total CO₂e",
            value: `${totalEmissions.toLocaleString("en-US", { maximumFractionDigits: 1 })} kg`,
            change: "0%",
            trend: "neutral" as const,
            icon: Leaf,
            description: "total emissions"
        },
        {
            title: "Avg. Daily Emissions",
            value: `${(totalEmissions / 30).toLocaleString("en-US", { maximumFractionDigits: 1 })} kg`,
            change: "0%",
            trend: "neutral" as const,
            icon: Zap,
            description: "est. based on 30d"
        },
        {
            title: "Top Category",
            value: topCategory ? topCategory.name : "N/A",
            change: topCategoryPercent ? `${topCategoryPercent}%` : "-",
            trend: "neutral" as const,
            icon: AlertCircle,
            description: "of total emissions"
        },
        {
            title: "Highest Emitting Dept",
            value: topDepartment ? topDepartment.dept_name : "N/A",
            change: topDeptPercent ? `${topDeptPercent}%` : "-",
            trend: "neutral" as const,
            icon: Building2,
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
                        <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 truncate" title={metric.value}>
                            {metric.value}
                        </div>
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
