import { useState, useEffect } from "react";
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
import { getOrganizations, getBranches, createDepartment } from "@/services/api";
import { Loader2, CheckCircle2 } from "lucide-react";

interface Organization {
    id: string;
    name: string;
}

interface Branch {
    id: string;
    name: string;
}

export function DeptForm() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedOrg, setSelectedOrg] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [branchLoading, setBranchLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBranch) {
            setError("Please select a branch");
            return;
        }
        if (!name.trim()) {
            setError("Department name is required");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await createDepartment(selectedBranch, name.trim());
            setSuccess(true);
            setName("");
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create department");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-w-xl">
            <div className="grid gap-2">
                <Label htmlFor="dept-org">Organization</Label>
                <Select value={selectedOrg} onValueChange={(val) => { setSelectedOrg(val); setSelectedBranch(""); }} disabled={fetchLoading}>
                    <SelectTrigger id="dept-org">
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
                <Label htmlFor="dept-branch">Select Branch</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch} disabled={!selectedOrg || branchLoading}>
                    <SelectTrigger id="dept-branch">
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
                <Label htmlFor="dept-name">Department Name</Label>
                <Input
                    id="dept-name"
                    placeholder="Finance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                />
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {success && (
                <p className="text-sm text-green-500 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Department created successfully!
                </p>
            )}

            <Button type="submit" className="w-fit" disabled={loading || fetchLoading}>
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                    </>
                ) : (
                    "Add Department"
                )}
            </Button>
        </form>
    );
}
