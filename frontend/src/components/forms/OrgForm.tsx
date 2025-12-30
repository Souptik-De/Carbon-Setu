import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function OrgForm() {
    return (
        <div className="grid gap-4 py-4 max-w-xl">
            <div className="grid gap-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" placeholder="Acme Inc." />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="org-desc">Description</Label>
                <Input id="org-desc" placeholder="Global Tech Solutions" />
            </div>
            <Button className="w-fit">Add Organization</Button>
        </div>
    );
}
