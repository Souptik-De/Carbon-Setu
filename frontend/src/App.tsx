import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnalyticsPage from "./pages/Analytics";
import { ComponentExample } from "@/components/component-example";

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ComponentExample />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                {/* Default redirect to analytics for now for easy viewing if desired, or keep as is */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;