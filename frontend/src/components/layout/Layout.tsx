import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

export function Layout() {
    return (
        <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100">
            <AppSidebar />
            <main className="flex-1 overflow-auto h-screen">
                <Outlet />
            </main>
        </div>
    );
}
