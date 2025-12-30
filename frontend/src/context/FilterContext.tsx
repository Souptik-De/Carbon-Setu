import { createContext, useContext, useState, type ReactNode } from "react";

interface FilterState {
    orgId: string | null;
    branchId: string | null;
    deptId: number | null;
    dateRange: { from: Date | undefined; to: Date | undefined };
}

interface FilterContextType extends FilterState {
    setOrgId: (id: string | null) => void;
    setBranchId: (id: string | null) => void;
    setDeptId: (id: number | null) => void;
    setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
    appliedFilters: FilterState;
    applyFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
    const [orgId, setOrgId] = useState<string | null>(null);
    const [branchId, setBranchId] = useState<string | null>(null);
    const [deptId, setDeptId] = useState<number | null>(null);
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined,
    });

    const [appliedFilters, setAppliedFilters] = useState<FilterState>({
        orgId: null,
        branchId: null,
        deptId: null,
        dateRange: { from: undefined, to: undefined }
    });

    const applyFilters = () => {
        setAppliedFilters({
            orgId,
            branchId,
            deptId,
            dateRange
        });
    };

    return (
        <FilterContext.Provider
            value={{
                orgId,
                setOrgId,
                branchId,
                setBranchId,
                deptId,
                setDeptId,
                dateRange,
                setDateRange,
                appliedFilters,
                applyFilters
            }}
        >
            {children}
        </FilterContext.Provider>
    );
}

export function useFilters() {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error("useFilters must be used within a FilterProvider");
    }
    return context;
}
