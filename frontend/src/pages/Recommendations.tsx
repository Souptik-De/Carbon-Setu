import { useEffect, useState } from "react";
import { fetchRecommendations, type Recommendation } from "@/services/api";
import { AlertTriangle, CheckCircle, TrendingDown, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/context/FilterContext";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";

export default function RecommendationsPage() {
    const { appliedFilters } = useFilters();
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRecommendations = async () => {
            if (!appliedFilters.orgId) {
                setRecommendations([]);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const data = await fetchRecommendations(
                    appliedFilters.orgId,
                    appliedFilters.branchId || undefined,
                    appliedFilters.deptId || undefined
                );
                setRecommendations(data);
            } catch (err) {
                setError("Failed to load recommendations. Please ensure the backend is running.");
            } finally {
                setLoading(false);
            }
        };

        loadRecommendations();
    }, [appliedFilters]);

    // Render loading state
    const renderContent = () => {
        if (!appliedFilters.orgId) {
            return (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <Sparkles className="h-12 w-12 text-neutral-300 mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Select and Show</h3>
                    <p className="text-neutral-500 max-w-md">
                        Please select an organization and click "Show" to view tailored carbon reduction recommendations.
                    </p>
                </div>
            );
        }

        if (loading) {
            return (
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-neutral-500">Analysing emission patterns...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {error}
                </div>
            );
        }

        if (recommendations.length === 0) {
            return (
                <div className="text-center py-20 text-neutral-400">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No specific recommendations found for this selection. Great job!</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec, index) => (
                    <div
                        key={index}
                        className="group flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="p-6 flex-1 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className={`
                                    px-3 py-1 rounded-full text-xs font-semibold
                                    ${rec.difficulty === 'Low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        rec.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}
                                `}>
                                    {rec.difficulty} Difficulty
                                </div>
                                {rec.category && (
                                    <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
                                        {rec.category}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 group-hover:text-primary transition-colors">
                                {rec.action}
                            </h3>

                            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                                {rec.description}
                            </p>

                            <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                <TrendingDown className="h-4 w-4" />
                                <span>Impact: {rec.impact}</span>
                            </div>

                            {rec.cost_estimate && (
                                <div className="text-xs text-neutral-400">
                                    Est. Cost: {rec.cost_estimate}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                            <Button variant="outline" className="w-full justify-between group-hover:border-primary/50 group-hover:text-primary">
                                Implement Action
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4 md:p-8 space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-yellow-500 fill-yellow-500/20" />
                        AI Recommendations
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-lg">
                        Actionable insights based on your selected organization's data.
                    </p>
                </div>

                {/* Reusing existing filters component for consistency */}
                <AnalyticsFilters />
            </div>

            {renderContent()}
        </div>
    );
}
