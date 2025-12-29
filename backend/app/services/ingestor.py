from io import StringIO

import pandas as pd

from app.database import supabase
from app.services.calculator import calculate_co2e


async def process_csv_log(file_content: str, dept_id: str):
    df = pd.read_csv(StringIO(file_content))
    logs = []

    for _, row in df.iterrows():
        try:
            category = row["category"]
            activity = row["activity"]
            value = float(row["value"])

            co2e, factor_id = calculate_co2e(category, activity, value)
            logs.append(
                {
                    "dept_id": int(dept_id),  # Convert to int for int8
                    "factor_id": int(factor_id),  # Ensure int for int8
                    "value": float(value),
                    "co2e_kg": float(co2e),
                    "entry_type": "csv",
                }
            )
        except Exception as e:
            print(f"Skipping row: {e}")

    if logs:
        supabase.table("carbon_logs").insert(logs).execute()
    return len(logs)