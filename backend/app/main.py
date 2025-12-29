from fastapi import FastAPI, UploadFile, File, HTTPException
from app.schemas import EmissionLogCreate
from app.services.calculator import calculate_co2e
from app.services.ingestor import process_csv_log
from app.database import supabase

app = FastAPI(title="Carbon-Setu API")

@app.post("/log/manual")
async def log_manual(data: EmissionLogCreate):
    try:
        co2e, factor_id = calculate_co2e(data.category, data.activity, data.value)
        
        log_entry = {
            "dept_id": data.dept_id,
            "factor_id": factor_id,
            "value": data.value,
            "co2e_kg": co2e,
            "entry_type": "manual"
        }
        
        res = supabase.table("carbon_logs").insert(log_entry).execute()
        return {"status": "success", "data": res.data}
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