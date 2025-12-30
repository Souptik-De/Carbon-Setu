import { KPIGrid } from "@/components/analytics/KPIGrid";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { CategoryChart } from "@/components/analytics/CategoryChart";
import { TrendChart } from "@/components/analytics/TrendChart";
// import { BreakdownChart } from "@/components/analytics/BreakdownChart";
// import { TopEmittersTable } from "@/components/analytics/TopEmittersTable";
import { useFilters } from "@/context/FilterContext";
import { useEffect, useState } from "react";
import { getEmissionsTotal, getEmissionsByCategory, getEmissionsByTime } from "@/services/api";
import { Sparkles, Loader2 } from "lucide-react";

export default function AnalyticsPage() {
    const { appliedFilters } = useFilters();
    const [totalEmissions, setTotalEmissions] = useState<number | null>(null);
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [trendData, setTrendData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!appliedFilters.orgId) {
                setTotalEmissions(null);
                setCategoryData([]);
                setTrendData([]);
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

                // Fetch Trend
                const trendProm = getEmissionsByTime(
                    appliedFilters.orgId,
                    appliedFilters.branchId || undefined,
                    appliedFilters.deptId || undefined,
                    "month"
                );

                const [totalRes, catRes, trendRes] = await Promise.all([totalProm, catProm, trendProm]);

                // Handle Total
                if (totalRes && totalRes.length > 0) {
                    setTotalEmissions(totalRes[0].total_emissions || 0);
                } else {
                    setTotalEmissions(0);
                }

                // Handle Category
                if (catRes) {
                    const formattedCat = catRes.map((item: any) => ({
                        name: item.category || item.category_name || "Unknown",
                        value: item.total_emissions,
                        ...item
                    }));
                    setCategoryData(formattedCat);
                }

                // Handle Trend
                if (trendRes) {
                    const formatted = trendRes.map((item: any) => ({
                        name: item.period,
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

                <AnalyticsFilters />
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
                        <KPIGrid totalEmissions={totalEmissions || 0} />
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

                    {/* Removed other charts to ensure only real data is shown */}
                </div>
            )}
        </div>
    );
}
