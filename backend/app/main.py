from fastapi import FastAPI, UploadFile, File, HTTPException
from app.schemas import (
    BranchCreate,
    DepartmentCreate,
    EmissionLogCreate,
    OrganizationCreate,
)
from app.services.calculator import calculate_co2e
from app.services.ingestor import process_csv_log
from app.database import supabase

app = FastAPI(title="Carbon-Setu API")


@app.post("/organizations")
async def create_organization(payload: OrganizationCreate):
    try:
        res = supabase.table("organizations").insert({"name": payload.name}).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to create organization")
        return {"status": "success", "data": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/branches")
async def create_branch(payload: BranchCreate):
    branch_row = {
        "org_id": payload.org_id,
        "name": payload.name,
    }
    if payload.location:
        branch_row["location"] = payload.location

    try:
        res = supabase.table("branches").insert(branch_row).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to create branch")
        return {"status": "success", "data": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/departments")
async def create_department(payload: DepartmentCreate):
    try:
        res = supabase.table("departments").insert(
            {"branch_id": payload.branch_id, "name": payload.name}
        ).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to create department")
        return {"status": "success", "data": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/log/manual")
async def log_manual(data: EmissionLogCreate):
    try:
        co2e, factor_id = calculate_co2e(data.category, data.activity, data.value)

        log_entry = {
            "dept_id": int(data.dept_id),  # This is now an int
            "factor_id": int(factor_id),  # This will be an int from calculate_co2e
            "value": float(data.value),
            "co2e_kg": float(co2e),
            "entry_type": data.entry_type,
        }

        res = supabase.table("carbon_logs").insert(log_entry).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to log entry")
        return {"status": "success", "data": res.data[0], "co2e_kg": co2e}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/log/csv/{dept_id}")
async def log_csv(dept_id: str, file: UploadFile = File(...)):
    content = await file.read()
    count = await process_csv_log(content.decode('utf-8'), dept_id)
    return {"status": "success", "rows_processed": count}

@app.get("/analytics/total/{org_id}")
async def get_org_total(org_id: str):
    # Professional 'Roll-up' using Supabase/Postgres
    # Sums all logs belonging to branches of this organization
    res = supabase.rpc('get_org_emissions', {'p_org_id': org_id}).execute()
    return res.data