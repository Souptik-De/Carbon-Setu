import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnalyticsPage from "./pages/Analytics";
import DataEntryPage from "./pages/DataEntry";
import { Layout } from "@/components/layout/Layout";
// import { ComponentExample } from "@/components/component-example";

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    {/* <Route path="/" element={<ComponentExample />} /> */}
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/data" element={<DataEntryPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;