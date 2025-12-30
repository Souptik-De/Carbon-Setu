import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnalyticsPage from "./pages/Analytics";
import DataEntryPage from "./pages/DataEntry";
import RecommendationsPage from "./pages/Recommendations";
import { Layout } from "@/components/layout/Layout";
// import { ComponentExample } from "@/components/component-example";

import { FilterProvider } from "@/context/FilterContext";

export function App() {
    return (
        <FilterProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        {/* <Route path="/" element={<ComponentExample />} /> */}
                        <Route path="/analytics" element={<AnalyticsPage />} />
                        <Route path="/data" element={<DataEntryPage />} />
                        <Route path="/recommendations" element={<RecommendationsPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </FilterProvider>
    );
}

export default App;