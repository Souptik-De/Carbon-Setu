import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Calendar, Download } from "lucide-react";

export function AnalyticsFilters() {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between p-1">

            {/* Filters Group */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Select defaultValue="all-orgs">
                    <SelectTrigger className="w-[180px] bg-white dark:bg-neutral-900">
                        <SelectValue placeholder="Organization" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-orgs">All Organizations</SelectItem>
                        <SelectItem value="tech-corp">Tech Corp Global</SelectItem>
                        <SelectItem value="green-inc">Green Inc.</SelectItem>
                    </SelectContent>
                </Select>

                <Select defaultValue="all-branches">
                    <SelectTrigger className="w-[180px] bg-white dark:bg-neutral-900">
                        <SelectValue placeholder="Branch" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-branches">All Branches</SelectItem>
                        <SelectItem value="ny-hq">New York HQ</SelectItem>
                        <SelectItem value="ldn-office">London Office</SelectItem>
                        <SelectItem value="mum-branch">Mumbai Branch</SelectItem>
                    </SelectContent>
                </Select>

                <Select defaultValue="all-depts">
                    <SelectTrigger className="w-[180px] bg-white dark:bg-neutral-900">
                        <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-depts">All Departments</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="ops">Operations</SelectItem>
                        <SelectItem value="it">IT & Engineering</SelectItem>
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

                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </div>
        </div>
    );
}
