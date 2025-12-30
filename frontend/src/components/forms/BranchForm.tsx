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

export function BranchForm() {
    return (
        <div className="grid gap-4 py-4 max-w-xl">
            <div className="grid gap-2">
                <Label htmlFor="branch-org">Organization</Label>
                <Select>
                    <SelectTrigger id="branch-org">
                        <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="org1">Tech Corp Global</SelectItem>
                        <SelectItem value="org2">Green Inc.</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="branch-name">Branch Name</Label>
                <Input id="branch-name" placeholder="New York HQ" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="branch-location">Location</Label>
                <Input id="branch-location" placeholder="New York, USA" />
            </div>
            <Button className="w-fit">Add Branch</Button>
        </div>
    );
}
