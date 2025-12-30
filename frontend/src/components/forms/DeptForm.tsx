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

export function DeptForm() {
    return (
        <div className="grid gap-4 py-4 max-w-xl">
            <div className="grid gap-2">
                <Label htmlFor="dept-branch">Select Branch</Label>
                <Select>
                    <SelectTrigger id="dept-branch">
                        <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="br1">New York HQ</SelectItem>
                        <SelectItem value="br2">London Office</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="dept-name">Department Name</Label>
                <Input id="dept-name" placeholder="Finance" />
            </div>
            <Button className="w-fit">Add Department</Button>
        </div>
    );
}
