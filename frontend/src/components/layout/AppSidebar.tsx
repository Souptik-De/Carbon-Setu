import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Database,
    Menu,
    ChevronLeft,
    Leaf,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => setCollapsed(!collapsed);

    const navItems = [
        {
            label: "Analytics",
            icon: LayoutDashboard,
            path: "/analytics",
        },
        {
            label: "Data Management",
            icon: Database,
            path: "/data",
        },
        {
            label: "Recommendations",
            icon: Sparkles,
            path: "/recommendations",
        }
    ];

    return (
        <div
            className={`relative flex flex-col h-screen border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 ${collapsed ? "w-[60px]" : "w-[240px]"
                }`}
        >
            {/* Header */}
            <div className="flex items-center gap-2 p-4 border-b border-neutral-100 dark:border-neutral-800 h-16">
                <Leaf className="h-6 w-6 text-primary flex-shrink-0" />
                {!collapsed && (
                    <span className="font-bold text-lg whitespace-nowrap overflow-hidden transition-all duration-300">
                        Carbon Setu
                    </span>
                )}
            </div>

            {/* Collapse Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-3 top-20 rounded-full h-6 w-6 border shadow-sm bg-background z-10 hidden md:flex"
                onClick={toggleSidebar}
            >
                {collapsed ? <Menu className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>


            {/* Navigation */}
            <div className="flex-1 py-6 px-3 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                                ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50"
                                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-50"
                                }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                            {!collapsed && (
                                <span className="whitespace-nowrap overflow-hidden transition-opacity duration-300">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* User Footer (Optional) */}
            <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">User Name</p>
                            <p className="text-xs text-neutral-500 truncate">user@org.com</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
