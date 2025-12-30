import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Play } from "lucide-react";
import { useFilters } from "@/context/FilterContext";
import { getOrganizations, getBranches, getDepartments } from "@/services/api";

interface AnalyticsFiltersProps {
    onExport?: () => void;
}

export function AnalyticsFilters({ onExport }: AnalyticsFiltersProps) {
    const {
        orgId, setOrgId,
        branchId, setBranchId,
        deptId, setDeptId,
        applyFilters
        // dateRange, setDateRange 
    } = useFilters();

    const [orgs, setOrgs] = useState<{ id: string; name: string }[]>([]);
    const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
    const [depts, setDepts] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        getOrganizations().then((data) => setOrgs(data || []));
    }, []);

    useEffect(() => {
        if (orgId) {
            getBranches(orgId).then((data) => setBranches(data || []));
            // Reset branch and dept when org changes
            setBranchId(null);
            setDeptId(null);
        } else {
            setBranches([]);
            setBranchId(null);
            setDeptId(null);
        }
    }, [orgId]);

    useEffect(() => {
        if (branchId) {
            getDepartments(branchId).then((data) => setDepts(data || []));
            // Reset dept when branch changes
            setDeptId(null);
        } else {
            setDepts([]);
            setDeptId(null);
        }
    }, [branchId]);

    return (
        <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between p-1">

            {/* Filters Group */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Select value={orgId || ""} onValueChange={setOrgId}>
                    <SelectTrigger className="w-[180px] bg-white dark:bg-neutral-900">
                        <SelectValue placeholder="Organization" />
                    </SelectTrigger>
                    <SelectContent>
                        {orgs.map((org) => (
                            <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={branchId || "all"} onValueChange={(val) => setBranchId(val === "all" ? null : val)} disabled={!orgId}>
                    <SelectTrigger className="w-[180px] bg-white dark:bg-neutral-900">
                        <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={deptId?.toString() || "all"}
                    onValueChange={(val) => setDeptId(val === "all" ? null : parseInt(val))}
                    disabled={!branchId}
                >
                    <SelectTrigger className="w-[180px] bg-white dark:bg-neutral-900">
                        <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {depts.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Date & Action Group */}
            <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                <Select defaultValue="30d">
                    <SelectTrigger className="w-[140px] bg-white dark:bg-neutral-900">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-neutral-400" />
                            <SelectValue placeholder="Period" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="90d">Last quarter</SelectItem>
                        <SelectItem value="ytd">Year to Date</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="default" onClick={applyFilters} disabled={!orgId} className="gap-2">
                    <Play className="h-4 w-4" />
                    Show
                </Button>

                {onExport && (
                    <Button variant="outline" className="gap-2" onClick={onExport}>
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                )}
            </div>
        </div>
    );
}
