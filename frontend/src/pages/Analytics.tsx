import { KPIGrid } from "@/components/analytics/KPIGrid";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { CategoryChart } from "@/components/analytics/CategoryChart";
import { TrendChart } from "@/components/analytics/TrendChart";
import { BreakdownChart } from "@/components/analytics/BreakdownChart";
import { TopEmittersTable } from "@/components/analytics/TopEmittersTable";
import { ReductionChart } from "@/components/analytics/ReductionChart";

export default function AnalyticsPage() {
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

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">

                {/* Row 1: KPI Cards */}
                <div className="lg:col-span-12">
                    <KPIGrid />
                </div>

                {/* Row 2: Category Contribution (Donut) & Trends (Line) */}
                <div className="lg:col-span-4 h-96 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6 flex flex-col">
                    <h3 className="font-semibold mb-6 text-neutral-900 dark:text-neutral-50">Emissions by Category</h3>
                    <div className="flex-1 w-full min-h-0">
                        <CategoryChart />
                    </div>
                </div>

                <div className="lg:col-span-8 h-96 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6 flex flex-col">
                    <h3 className="font-semibold mb-6 text-neutral-900 dark:text-neutral-50">Emission Trends</h3>
                    <div className="flex-1 w-full min-h-0">
                        <TrendChart />
                    </div>
                </div>

                {/* Row 3: Breakdown (Stacked Bar) & Top Emitters (Table) */}
                <div className="lg:col-span-8 h-96 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">Branch & Dept Breakdown</h3>
                        {/* Legend or small toggle could go here */}
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <BreakdownChart />
                    </div>
                </div>

                <div className="lg:col-span-4 h-96 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 pb-2">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">Top Emitters</h3>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <TopEmittersTable />
                    </div>
                </div>

                {/* Row 4: Reduction Opportunities (Horizontal Bar) */}
                <div className="lg:col-span-12 h-80 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">Reduction Opportunities</h3>
                            <p className="text-sm text-neutral-500">Estimated potential based on rule engine analysis</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ReductionChart />
                    </div>
                </div>

            </div>
        </div>
    );
}
