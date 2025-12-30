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
import { UploadCloud } from "lucide-react";

export function LogsForm() {
    return (
        <div className="py-2">
            <Tabs defaultValue="manual" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    <TabsTrigger value="csv">CSV Upload</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4 max-w-xl">
                    <div className="grid gap-2">
                        <Label htmlFor="log-dept">Department</Label>
                        <Select>
                            <SelectTrigger id="log-dept">
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="d1">Finance - NY</SelectItem>
                                <SelectItem value="d2">Ops - London</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="log-cat">Category</Label>
                            <Select>
                                <SelectTrigger id="log-cat">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="electricity">Electricity</SelectItem>
                                    <SelectItem value="transport">Transport</SelectItem>
                                    <SelectItem value="waste">Waste</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="log-val">Value (kWh/km/kg)</Label>
                            <Input id="log-val" placeholder="0.00" type="number" />
                        </div>
                    </div>

                    <Button>Log Emission</Button>
                </TabsContent>

                <TabsContent value="csv" className="space-y-4 max-w-xl">
                    <div className="grid gap-2">
                        <Label htmlFor="csv-dept">Department</Label>
                        <Select>
                            <SelectTrigger id="csv-dept">
                                <SelectValue placeholder="Select Department to Log For" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="d1">Finance - NY</SelectItem>
                                <SelectItem value="d2">Ops - London</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <UploadCloud className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Click to upload CSV</h3>
                            <p className="text-sm text-neutral-500">or drag and drop file here</p>
                        </div>
                    </div>
                    <Button>Upload & Process</Button>
                </TabsContent>
            </Tabs>
        </div>
    );
}
