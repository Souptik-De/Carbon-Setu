import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createOrganization } from "@/services/api";
import { Loader2, CheckCircle2 } from "lucide-react";

export function OrgForm() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Organization name is required");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await createOrganization(name.trim());
            setSuccess(true);
            setName("");
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create organization");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-w-xl">
            <div className="grid gap-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                    id="org-name"
                    placeholder="Acme Inc."
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
                    Organization created successfully!
                </p>
            )}

            <Button type="submit" className="w-fit" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                    </>
                ) : (
                    "Add Organization"
                )}
            </Button>
        </form>
    );
}
