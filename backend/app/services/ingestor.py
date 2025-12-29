import pandas as pd
from io import StringIO
from app.services.calculator import calculate_co2e
from app.database import supabase

async def process_csv_log(file_content: str, dept_id: str):
    df = pd.read_csv(StringIO(file_content))
    logs = []
    
    for _, row in df.iterrows():
        try:
            co2e, factor_id = calculate_co2e(row['category'], row['activity'], row['value'])
            logs.append({
                "dept_id": dept_id,
                "factor_id": factor_id,
                "value": row['value'],
                "co2e_kg": co2e,
                "entry_type": "csv"
            })
        except Exception as e:
            print(f"Skipping row: {e}")
            
    if logs:
        supabase.table("carbon_logs").insert(logs).execute()
    return len(logs)