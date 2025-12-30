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
import { getOrganizations, createBranch } from "@/services/api";
import { Loader2, CheckCircle2 } from "lucide-react";

interface Organization {
    id: string;
    name: string;
}

export function BranchForm() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrg, setSelectedOrg] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrg) {
            setError("Please select an organization");
            return;
        }
        if (!name.trim()) {
            setError("Branch name is required");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await createBranch(selectedOrg, name.trim());
            setSuccess(true);
            setName("");
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create branch");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-w-xl">
            <div className="grid gap-2">
                <Label htmlFor="branch-org">Organization</Label>
                <Select value={selectedOrg} onValueChange={setSelectedOrg} disabled={fetchLoading}>
                    <SelectTrigger id="branch-org">
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
                <Label htmlFor="branch-name">Branch Name</Label>
                <Input
                    id="branch-name"
                    placeholder="New York HQ"
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
                    Branch created successfully!
                </p>
            )}

            <Button type="submit" className="w-fit" disabled={loading || fetchLoading}>
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                    </>
                ) : (
                    "Add Branch"
                )}
            </Button>
        </form>
    );
}
