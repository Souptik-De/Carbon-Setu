import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building2, Landmark, MapPin, FileSpreadsheet } from "lucide-react";
import { OrgForm } from "@/components/forms/OrgForm";
import { BranchForm } from "@/components/forms/BranchForm";
import { DeptForm } from "@/components/forms/DeptForm";
import { LogsForm } from "@/components/forms/LogsForm";

export default function DataEntryPage() {
    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
                    Data Management
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Manage your organization structure and update carbon emission logs.
                </p>
            </div>

            <Tabs defaultValue="org" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-[600px] mb-8 h-auto lg:h-10 gap-2 lg:gap-0">
                    <TabsTrigger value="org" className="gap-2"><Building2 className="h-4 w-4" /> Organization</TabsTrigger>
                    <TabsTrigger value="branch" className="gap-2"><Landmark className="h-4 w-4" /> Branch</TabsTrigger>
                    <TabsTrigger value="dept" className="gap-2"><MapPin className="h-4 w-4" /> Department</TabsTrigger>
                    <TabsTrigger value="logs" className="gap-2"><FileSpreadsheet className="h-4 w-4" /> Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="org">
                    <Card>
                        <CardHeader>
                            <CardTitle>Organization Details</CardTitle>
                            <CardDescription>
                                Add or update organization information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrgForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="branch">
                    <Card>
                        <CardHeader>
                            <CardTitle>Branch Management</CardTitle>
                            <CardDescription>
                                Manage branches within your organizations.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BranchForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="dept">
                    <Card>
                        <CardHeader>
                            <CardTitle>Department Management</CardTitle>
                            <CardDescription>
                                Configure departments for each branch.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DeptForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="logs">
                    <Card>
                        <CardHeader>
                            <CardTitle>Carbon Logs</CardTitle>
                            <CardDescription>
                                Upload CSVs or manually enter emission data.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LogsForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
