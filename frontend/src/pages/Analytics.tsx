import { KPIGrid } from "@/components/analytics/KPIGrid";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { CategoryChart } from "@/components/analytics/CategoryChart";
import { TrendChart } from "@/components/analytics/TrendChart";
import { BreakdownChart } from "@/components/analytics/BreakdownChart";
import { TopEmittersTable } from "@/components/analytics/TopEmittersTable";
import { useFilters } from "@/context/FilterContext";
import { useEffect, useState } from "react";
import { getEmissionsTotal, getEmissionsByCategory, getEmissionsByTime, getEmissionsByDepartment } from "@/services/api";
import { Sparkles, Loader2 } from "lucide-react";

interface CategoryData {
    name: string;
    value: number;
}

interface DepartmentData {
    dept_id: string;
    dept_name: string;
    total_emissions: number;
}

interface BreakdownData {
    name: string;
    [category: string]: string | number;
}

interface EmitterData {
    dept_name: string;
    category: string;
    emissions: number;
    percent: number;
}

export default function AnalyticsPage() {
    const { appliedFilters } = useFilters();
    const [totalEmissions, setTotalEmissions] = useState<number | null>(null);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
    const [trendData, setTrendData] = useState<any[]>([]);
    const [breakdownData, setBreakdownData] = useState<BreakdownData[]>([]);
    const [topEmittersData, setTopEmittersData] = useState<EmitterData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!appliedFilters.orgId) {
                setTotalEmissions(null);
                setCategoryData([]);
                setDepartmentData([]);
                setTrendData([]);
                setBreakdownData([]);
                setTopEmittersData([]);
                return;
            }

            setLoading(true);
            try {
                // Fetch Total
                const totalProm = getEmissionsTotal(
                    appliedFilters.orgId,
                    appliedFilters.branchId || undefined,
                    appliedFilters.deptId || undefined
                );

                // Fetch Category Breakdown
                const catProm = getEmissionsByCategory(
                    appliedFilters.orgId,
                    appliedFilters.branchId || undefined,
                    appliedFilters.deptId || undefined
                );

                // Fetch Department Breakdown (only if not filtering by a specific dept)
                const deptProm = !appliedFilters.deptId
                    ? getEmissionsByDepartment(
                        appliedFilters.orgId,
                        appliedFilters.branchId || undefined
                    )
                    : Promise.resolve([]);

                // Fetch Trend
                const trendProm = getEmissionsByTime(
                    appliedFilters.orgId,
                    appliedFilters.branchId || undefined,
                    appliedFilters.deptId || undefined,
                    "month"
                );

                const [totalRes, catRes, deptRes, trendRes] = await Promise.all([totalProm, catProm, deptProm, trendProm]);

                // Handle Total - API may return number directly or array with objects
                let total = 0;
                if (totalRes !== null && totalRes !== undefined) {
                    if (typeof totalRes === 'number') {
                        // Org total returns a direct number
                        total = totalRes;
                    } else if (Array.isArray(totalRes) && totalRes.length > 0) {
                        // Branch/Dept totals return array with objects
                        total = totalRes[0].total_emissions || 0;
                    } else if (typeof totalRes === 'object' && 'total_emissions' in totalRes) {
                        // Single object response
                        total = totalRes.total_emissions || 0;
                    }
                    setTotalEmissions(total);
                } else {
                    setTotalEmissions(0);
                }

                // Handle Category
                let formattedCat: CategoryData[] = [];
                if (catRes) {
                    formattedCat = catRes.map((item: any) => ({
                        name: item.category || item.category_name || "Unknown",
                        value: item.total_emissions || item.value || 0,
                        ...item
                    }));
                    setCategoryData(formattedCat);
                }

                // Handle Department
                if (deptRes && deptRes.length > 0) {
                    setDepartmentData(deptRes);

                    // Create breakdown data for BreakdownChart
                    // This shows each department's emissions breakdown
                    const breakdown: BreakdownData[] = deptRes.slice(0, 5).map((dept: DepartmentData) => ({
                        name: dept.dept_name.length > 12 ? dept.dept_name.slice(0, 12) + '...' : dept.dept_name,
                        Emissions: dept.total_emissions
                    }));
                    setBreakdownData(breakdown);

                    // Create top emitters data combining dept info
                    // Show top emitting departments with their contribution %
                    const emitters: EmitterData[] = deptRes
                        .slice(0, 6)
                        .map((dept: DepartmentData) => ({
                            dept_name: dept.dept_name,
                            category: "All Categories",
                            emissions: dept.total_emissions,
                            percent: total > 0 ? (dept.total_emissions / total) * 100 : 0
                        }));
                    setTopEmittersData(emitters);
                } else if (appliedFilters.deptId) {
                    setDepartmentData([]);
                    setBreakdownData([]);
                    // When filtering by specific dept, show category breakdown as emitters
                    if (formattedCat.length > 0) {
                        const emitters: EmitterData[] = formattedCat
                            .slice(0, 6)
                            .map((cat) => ({
                                dept_name: "Selected Dept",
                                category: cat.name,
                                emissions: cat.value,
                                percent: total > 0 ? (cat.value / total) * 100 : 0
                            }));
                        setTopEmittersData(emitters);
                    } else {
                        setTopEmittersData([]);
                    }
                } else {
                    setDepartmentData([]);
                    setBreakdownData([]);
                    setTopEmittersData([]);
                }

                // Handle Trend
                if (trendRes) {
                    const formatted = trendRes.map((item: any) => ({
                        name: item.period_start || item.period,
                        date: item.period_start || item.period,
                        emissions: item.total_emissions
                    }));
                    setTrendData(formatted);
                }

            } catch (error) {
                console.error("Failed to fetch analytics data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [appliedFilters]);

    const handleExport = () => {
        if ((!totalEmissions && totalEmissions !== 0) || categoryData.length === 0) {
            // Nothing to export or data not loaded
            return;
        }

        // Prepare CSV content
        const rows = [
            ["Metric", "Value"],
            ["Total Emissions", `${totalEmissions} kg`]
        ];

        // Top Category
        const topCat = categoryData.reduce((prev, curr) => (curr.value > prev.value ? curr : prev), categoryData[0]);
        if (topCat) {
            rows.push(["Top Category", topCat.name]);
        }

        // Top Department
        if (departmentData && departmentData.length > 0) {
            const topDept = departmentData.reduce((prev, curr) => (curr.total_emissions > prev.total_emissions ? curr : prev), departmentData[0]);
            if (topDept) {
                rows.push(["Highest Emitting Dept", topDept.dept_name]);
            }
        }

        rows.push([]);
        rows.push(["Category Breakdown", "Emissions (kg)"]);
        categoryData.forEach(c => rows.push([c.name, c.value.toString()]));

        if (departmentData && departmentData.length > 0) {
            rows.push([]);
            rows.push(["Department Breakdown", "Emissions (kg)"]);
            departmentData.forEach(d => rows.push([d.dept_name, d.total_emissions.toString()]));
        }

        if (trendData && trendData.length > 0) {
            rows.push([]);
            rows.push(["Trend Data (Date)", "Emissions (kg)"]);
            trendData.forEach(t => rows.push([t.date || t.name, t.emissions || 0]));
        }

        const csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `carbon_analytics_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!appliedFilters.orgId) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4 md:p-8 space-y-8 font-sans">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
                            Carbon Analytics
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Monitor, measure, and reduce your organization's carbon footprint.
                        </p>
                    </div>
                    <AnalyticsFilters />
                </div>

                <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <Sparkles className="h-12 w-12 text-neutral-300 mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Select and Show</h3>
                    <p className="text-neutral-500 max-w-md">
                        Please select an organization and click "Show" to view analytics data.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4 md:p-8 space-y-8 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
                        Carbon Analytics
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Monitor, measure, and reduce your organization's carbon footprint.
                    </p>
                </div>

                <AnalyticsFilters onExport={handleExport} />
            </div>

            {loading ? (
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-neutral-500">Loading analytics data...</span>
                </div>
            ) : (
                /* Main Grid Layout */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">

                    {/* Row 1: KPI Cards */}
                    <div className="lg:col-span-12">
                        <KPIGrid
                            totalEmissions={totalEmissions || 0}
                            categoryData={categoryData}
                            departmentData={departmentData}
                        />
                    </div>

                    {/* Row 2: Category Contribution (Donut) & Trends (Line) */}
                    <div className="lg:col-span-4 h-96 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6 flex flex-col">
                        <h3 className="font-semibold mb-6 text-neutral-900 dark:text-neutral-50">Emissions by Category</h3>
                        <div className="flex-1 w-full min-h-0">
                            <CategoryChart data={categoryData} />
                        </div>
                    </div>

                    <div className="lg:col-span-8 h-96 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6 flex flex-col">
                        <h3 className="font-semibold mb-6 text-neutral-900 dark:text-neutral-50">Emission Trends</h3>
                        <div className="flex-1 w-full min-h-0">
                            <TrendChart data={trendData} />
                        </div>
                    </div>

                    {/* Row 3: Department Breakdown (Bar Chart) & Top Emitters Table */}
                    <div className="lg:col-span-5 h-80 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6 flex flex-col">
                        <h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-50">Emissions by Department</h3>
                        <div className="flex-1 w-full min-h-0">
                            <BreakdownChart data={breakdownData} />
                        </div>
                    </div>

                    <div className="lg:col-span-7 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6 flex flex-col">
                        <h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-50">Top Emitters</h3>
                        <TopEmittersTable data={topEmittersData} />
                    </div>
                </div>
            )}
        </div>
    );
}
