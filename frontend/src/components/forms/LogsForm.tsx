import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UploadCloud, Loader2, CheckCircle2 } from "lucide-react";
import {
    getOrganizations,
    getBranches,
    getDepartments,
    logManualEmission,
    uploadCSVLogs,
} from "@/services/api";

interface Organization {
    id: string;
    name: string;
}

interface Branch {
    id: string;
    name: string;
}

interface Department {
    id: number;
    name: string;
}

// Categories and activities that match the emission_factors table in the backend
const EMISSION_CATEGORIES = [
    { category: "Energy", activities: ["Grid Electricity", "Natural Gas"], unit: "kWh/m³" },
    { category: "Transport", activities: ["Petrol (Passenger Car)", "Diesel (Truck/Van)"], unit: "Litres" },
    { category: "Waste", activities: ["General Landfill", "Paper Recycling"], unit: "Tonnes" },
    { category: "Water", activities: ["Municipal Water"], unit: "m³" },
    { category: "Travel", activities: ["Short-haul Flight", "Long-haul Flight"], unit: "km" },
];

export function LogsForm() {
    // Shared state for org/branch/dept selection
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedOrg, setSelectedOrg] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedDept, setSelectedDept] = useState("");

    // Loading states
    const [fetchLoading, setFetchLoading] = useState(true);
    const [branchLoading, setBranchLoading] = useState(false);
    const [deptLoading, setDeptLoading] = useState(false);

    // Manual entry state
    const [category, setCategory] = useState("");
    const [activity, setActivity] = useState("");
    const [value, setValue] = useState("");
    const [manualLoading, setManualLoading] = useState(false);
    const [manualSuccess, setManualSuccess] = useState(false);
    const [manualError, setManualError] = useState<string | null>(null);

    // CSV upload state
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [csvLoading, setCsvLoading] = useState(false);
    const [csvSuccess, setCsvSuccess] = useState(false);
    const [csvError, setCsvError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get available activities based on selected category
    const availableActivities = EMISSION_CATEGORIES.find(c => c.category === category)?.activities || [];

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const orgs = await getOrganizations();
                setOrganizations(orgs || []);
            } catch (err) {
                console.error("Failed to fetch organizations:", err);
            } finally {
                setFetchLoading(false);
            }
        };
        fetchOrgs();
    }, []);

    useEffect(() => {
        if (!selectedOrg) {
            setBranches([]);
            setSelectedBranch("");
            setDepartments([]);
            setSelectedDept("");
            return;
        }

        const fetchBranches = async () => {
            setBranchLoading(true);
            try {
                const branchList = await getBranches(selectedOrg);
                setBranches(branchList || []);
            } catch (err) {
                console.error("Failed to fetch branches:", err);
            } finally {
                setBranchLoading(false);
            }
        };
        fetchBranches();
    }, [selectedOrg]);

    useEffect(() => {
        if (!selectedBranch) {
            setDepartments([]);
            setSelectedDept("");
            return;
        }

        const fetchDepts = async () => {
            setDeptLoading(true);
            try {
                const deptList = await getDepartments(selectedBranch);
                setDepartments(deptList || []);
            } catch (err) {
                console.error("Failed to fetch departments:", err);
            } finally {
                setDeptLoading(false);
            }
        };
        fetchDepts();
    }, [selectedBranch]);

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDept) {
            setManualError("Please select a department");
            return;
        }
        if (!category || !activity) {
            setManualError("Please select category and activity");
            return;
        }
        if (!value || parseFloat(value) <= 0) {
            setManualError("Please enter a valid value");
            return;
        }

        setManualLoading(true);
        setManualError(null);
        setManualSuccess(false);

        try {
            await logManualEmission(parseInt(selectedDept), category, activity, parseFloat(value));
            setManualSuccess(true);
            setValue("");
            setCategory("");
            setActivity("");
            setTimeout(() => setManualSuccess(false), 3000);
        } catch (err) {
            setManualError(err instanceof Error ? err.message : "Failed to log emission");
        } finally {
            setManualLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCsvFile(e.target.files[0]);
        }
    };

    const handleCsvSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDept) {
            setCsvError("Please select a department");
            return;
        }
        if (!csvFile) {
            setCsvError("Please select a CSV file");
            return;
        }

        setCsvLoading(true);
        setCsvError(null);
        setCsvSuccess(false);

        try {
            const result = await uploadCSVLogs(selectedDept, csvFile);
            setCsvSuccess(true);
            setCsvFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setTimeout(() => setCsvSuccess(false), 3000);
        } catch (err) {
            setCsvError(err instanceof Error ? err.message : "Failed to upload CSV");
        } finally {
            setCsvLoading(false);
        }
    };

    // Shared department selector component
    const DepartmentSelector = () => (
        <>
            <div className="grid gap-2">
                <Label>Organization</Label>
                <Select value={selectedOrg} onValueChange={(val) => { setSelectedOrg(val); setSelectedBranch(""); setSelectedDept(""); }} disabled={fetchLoading}>
                    <SelectTrigger>
                        <SelectValue placeholder={fetchLoading ? "Loading..." : "Select Organization"} />
                    </SelectTrigger>
                    <SelectContent>
                        {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                                {org.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label>Branch</Label>
                <Select value={selectedBranch} onValueChange={(val) => { setSelectedBranch(val); setSelectedDept(""); }} disabled={!selectedOrg || branchLoading}>
                    <SelectTrigger>
                        <SelectValue placeholder={branchLoading ? "Loading..." : "Select Branch"} />
                    </SelectTrigger>
                    <SelectContent>
                        {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                                {branch.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label>Department</Label>
                <Select value={selectedDept} onValueChange={setSelectedDept} disabled={!selectedBranch || deptLoading}>
                    <SelectTrigger>
                        <SelectValue placeholder={deptLoading ? "Loading..." : "Select Department"} />
                    </SelectTrigger>
                    <SelectContent>
                        {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id.toString()}>
                                {dept.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </>
    );

    return (
        <div className="py-2">
            <Tabs defaultValue="manual" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    <TabsTrigger value="csv">CSV Upload</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4 max-w-xl">
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                        <DepartmentSelector />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="log-cat">Category</Label>
                                <Select value={category} onValueChange={(val) => { setCategory(val); setActivity(""); }}>
                                    <SelectTrigger id="log-cat">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EMISSION_CATEGORIES.map((cat) => (
                                            <SelectItem key={cat.category} value={cat.category}>
                                                {cat.category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="log-act">Activity</Label>
                                <Select value={activity} onValueChange={setActivity} disabled={!category}>
                                    <SelectTrigger id="log-act">
                                        <SelectValue placeholder="Select Activity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableActivities.map((act) => (
                                            <SelectItem key={act} value={act}>
                                                {act}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="log-val">Value (kWh/km/kg)</Label>
                            <Input
                                id="log-val"
                                placeholder="0.00"
                                type="number"
                                step="0.01"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                disabled={manualLoading}
                            />
                        </div>

                        {manualError && (
                            <p className="text-sm text-red-500">{manualError}</p>
                        )}

                        {manualSuccess && (
                            <p className="text-sm text-green-500 flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" />
                                Emission logged successfully!
                            </p>
                        )}

                        <Button type="submit" disabled={manualLoading}>
                            {manualLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Logging...
                                </>
                            ) : (
                                "Log Emission"
                            )}
                        </Button>
                    </form>
                </TabsContent>

                <TabsContent value="csv" className="space-y-4 max-w-xl">
                    <form onSubmit={handleCsvSubmit} className="space-y-4">
                        <DepartmentSelector />

                        <div
                            className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="p-4 bg-primary/10 rounded-full">
                                <UploadCloud className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    {csvFile ? csvFile.name : "Click to upload CSV"}
                                </h3>
                                <p className="text-sm text-neutral-500">
                                    {csvFile ? `${(csvFile.size / 1024).toFixed(1)} KB` : "or drag and drop file here"}
                                </p>
                            </div>
                        </div>

                        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 text-sm">
                            <p className="font-medium mb-2">CSV Format Required:</p>
                            <code className="block bg-neutral-200 dark:bg-neutral-800 p-2 rounded text-xs">
                                category,activity,value<br />
                                Energy,Grid Electricity,500<br />
                                Transport,Petrol (Passenger Car),50
                            </code>
                        </div>

                        {csvError && (
                            <p className="text-sm text-red-500">{csvError}</p>
                        )}

                        {csvSuccess && (
                            <p className="text-sm text-green-500 flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" />
                                CSV uploaded and processed successfully!
                            </p>
                        )}

                        <Button type="submit" disabled={csvLoading}>
                            {csvLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                "Upload & Process"
                            )}
                        </Button>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    );
}
