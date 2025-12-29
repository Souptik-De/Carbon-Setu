from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from typing import Optional
from datetime import datetime
from app.schemas import (
    BranchCreate,
    DepartmentCreate,
    EmissionLogCreate,
    OrganizationCreate,
)
from app.services.calculator import calculate_co2e
from app.services.ingestor import process_csv_log
from app.services.recommendation_engine import RecommendationEngine
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


@app.get("/analytics/org/{org_id}/total")
async def get_org_total(org_id: str):
    """Get total emissions for an organization across all branches and departments"""
    try:
        res = supabase.rpc('get_org_emissions', {'p_org_id': org_id}).execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/analytics/branch/{branch_id}/total")
async def get_branch_total(branch_id: str):
    """Get total emissions for a specific branch"""
    try:
        res = supabase.rpc('get_branch_emissions', {'p_branch_id': branch_id}).execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/analytics/department/{dept_id}/total")
async def get_department_total(dept_id: int):
    """Get total emissions for a specific department"""
    try:
        res = supabase.rpc('get_department_emissions', {'p_dept_id': dept_id}).execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Time-based rollups
@app.get("/analytics/org/{org_id}/by-time")
async def get_org_emissions_by_time(
    org_id: str,
    period: str = "month",  # day, week, month, year
    start_date: str = None,
    end_date: str = None
):
    """Get emissions for an organization grouped by time period"""
    try:
        params = {
            'p_org_id': org_id,
            'p_period': period,
            'p_start_date': start_date,
            'p_end_date': end_date
        }
        # Remove None values
        params = {k: v for k, v in params.items() if v is not None}
        
        res = supabase.rpc('get_org_emissions_by_time', params).execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/analytics/branch/{branch_id}/by-time")
async def get_branch_emissions_by_time(
    branch_id: str,
    period: str = "month",  # day, week, month, year
    start_date: str = None,
    end_date: str = None
):
    """Get emissions for a branch grouped by time period"""
    try:
        params = {
            'p_branch_id': branch_id,
            'p_period': period,
            'p_start_date': start_date,
            'p_end_date': end_date
        }
        # Remove None values
        params = {k: v for k, v in params.items() if v is not None}
        
        res = supabase.rpc('get_branch_emissions_by_time', params).execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/recommendations")
async def get_recommendations(
    org_id: Optional[str] = Query(None, description="Organization ID"),
    branch_id: Optional[str] = Query(None, description="Branch ID"),
    dept_id: Optional[int] = Query(None, description="Department ID"),
    start_date: Optional[str] = Query(
        None, 
        description="Start date (YYYY-MM-DD)",
        regex="^\\d{4}-\\d{2}-\\d{2}$"
    ),
    end_date: Optional[str] = Query(
        None,
        description="End date (YYYY-MM-DD)",
        regex="^\\d{4}-\\d{2}-\\d{2}$"
    )
):
    """
    Get AI-powered recommendations for reducing carbon emissions
    """
    if not any([org_id, branch_id, dept_id]):
        raise HTTPException(
            status_code=400,
            detail="At least one of org_id, branch_id, or dept_id must be provided"
        )
    
    # Validate dates if provided
    if start_date and end_date:
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            if start > end:
                raise HTTPException(
                    status_code=400,
                    detail="Start date must be before end date"
                )
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid date format. Use YYYY-MM-DD"
            )
    
    try:
        engine = RecommendationEngine()
        recommendations = engine.generate_recommendations(
            org_id=org_id,
            branch_id=branch_id,
            dept_id=dept_id,
            start_date=start_date,
            end_date=end_date
        )
        
        return {
            "status": "success",
            "data": {
                "recommendations": recommendations,
                "context": {
                    "org_id": org_id,
                    "branch_id": branch_id,
                    "dept_id": dept_id,
                    "start_date": start_date,
                    "end_date": end_date
                }
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recommendations: {str(e)}"
        )