export interface Recommendation {
    id: string;
    description: string;
    impact: string;
    difficulty: "Low" | "Medium" | "High";
    action: string;
    category?: string;
    cost_estimate?: string;
}

export interface RecommendationResponse {
    status: string;
    data: {
        recommendations: Recommendation[];
        context: any;
    };
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const fetchRecommendations = async (
    orgId?: string,
    branchId?: string,
    deptId?: number,
    startDate?: string,
    endDate?: string
): Promise<Recommendation[]> => {
    try {
        const params = new URLSearchParams();
        if (orgId) params.append("org_id", orgId);
        if (branchId) params.append("branch_id", branchId);
        if (deptId) params.append("dept_id", deptId.toString());
        if (startDate) params.append("start_date", startDate);
        if (endDate) params.append("end_date", endDate);

        const response = await fetch(`${API_URL}/recommendations?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Error fetching recommendations: ${response.statusText}`);
        }
        const data: RecommendationResponse = await response.json();
        return data.data.recommendations;
    } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        throw error;
    }
};

export const getOrganizations = async () => {
    const response = await fetch(`${API_URL}/organizations`);
    const json = await response.json();
    return json.data;
};

export const getBranches = async (orgId: string) => {
    const response = await fetch(`${API_URL}/branches/${orgId}`);
    const json = await response.json();
    return json.data;
};

export const getDepartments = async (branchId: string) => {
    const response = await fetch(`${API_URL}/departments/${branchId}`);
    const json = await response.json();
    return json.data;
};

export const getEmissionsTotal = async (
    orgId?: string,
    branchId?: string,
    deptId?: number
) => {
    let url = "";
    if (deptId) {
        url = `${API_URL}/analytics/department/${deptId}/total`;
    } else if (branchId) {
        url = `${API_URL}/analytics/branch/${branchId}/total`;
    } else if (orgId) {
        url = `${API_URL}/analytics/org/${orgId}/total`;
    } else {
        return null;
    }

    const response = await fetch(url);
    const json = await response.json();
    return json.data;
};

export const getEmissionsByCategory = async (
    orgId?: string,
    branchId?: string,
    deptId?: number
) => {
    let url = "";
    if (deptId) {
        url = `${API_URL}/analytics/department/${deptId}/by-category`;
    } else if (branchId) {
        url = `${API_URL}/analytics/branch/${branchId}/by-category`;
    } else if (orgId) {
        url = `${API_URL}/analytics/org/${orgId}/by-category`;
    } else {
        return null;
    }

    const response = await fetch(url);
    const json = await response.json();
    return json.data;
};

export const getEmissionsByTime = async (
    orgId?: string,
    branchId?: string,
    deptId?: number,
    period: "day" | "week" | "month" | "year" = "month"
) => {
    let url = "";
    if (deptId) {
        // Dept by time not yet implemented in backend, fallback to empty or implement?
        // Backend only has org/branch by time.
        return [];
    } else if (branchId) {
        url = `${API_URL}/analytics/branch/${branchId}/by-time?period=${period}`;
    } else if (orgId) {
        url = `${API_URL}/analytics/org/${orgId}/by-time?period=${period}`;
    } else {
        return null;
    }

    const response = await fetch(url);
    const json = await response.json();
    return json.data;
};

export const getEmissionsByDepartment = async (
    orgId?: string,
    branchId?: string
) => {
    let url = "";
    if (branchId) {
        url = `${API_URL}/analytics/branch/${branchId}/by-department`;
    } else if (orgId) {
        url = `${API_URL}/analytics/org/${orgId}/by-department`;
    } else {
        return null;
    }

    const response = await fetch(url);
    const json = await response.json();
    return json.data;
};

// POST functions for Data Management

export const createOrganization = async (name: string) => {
    const response = await fetch(`${API_URL}/organizations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to create organization");
    }
    const json = await response.json();
    return json.data;
};

export const createBranch = async (orgId: string, name: string) => {
    const response = await fetch(`${API_URL}/branches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org_id: orgId, name }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to create branch");
    }
    const json = await response.json();
    return json.data;
};

export const createDepartment = async (branchId: string, name: string) => {
    const response = await fetch(`${API_URL}/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch_id: branchId, name }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to create department");
    }
    const json = await response.json();
    return json.data;
};

export const logManualEmission = async (
    deptId: number,
    category: string,
    activity: string,
    value: number,
    activityDate?: string  // Optional: YYYY-MM-DD format
) => {
    const response = await fetch(`${API_URL}/log/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            dept_id: deptId,
            category,
            activity,
            value,
            entry_type: "manual",
            activity_date: activityDate || null,
        }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to log emission");
    }
    const json = await response.json();
    return json;
};

export const uploadCSVLogs = async (deptId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/log/csv/${deptId}`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to upload CSV");
    }
    const json = await response.json();
    return json;
};
