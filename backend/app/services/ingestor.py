from io import StringIO
from datetime import datetime

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
            
            # Get activity_date if provided in CSV, otherwise use today
            if "activity_date" in df.columns and pd.notna(row.get("activity_date")):
                # Parse the date - support common formats
                date_str = str(row["activity_date"])
                try:
                    # Try ISO format first (YYYY-MM-DD)
                    activity_date = datetime.strptime(date_str.split("T")[0], "%Y-%m-%d").date().isoformat()
                except ValueError:
                    try:
                        # Try DD/MM/YYYY format
                        activity_date = datetime.strptime(date_str, "%d/%m/%Y").date().isoformat()
                    except ValueError:
                        # Default to today if parsing fails
                        activity_date = datetime.now().date().isoformat()
            else:
                activity_date = datetime.now().date().isoformat()

            co2e, factor_id = calculate_co2e(category, activity, value)
            logs.append(
                {
                    "dept_id": int(dept_id),  # Convert to int for int8
                    "factor_id": int(factor_id),  # Ensure int for int8
                    "value": float(value),
                    "co2e_kg": float(co2e),
                    "entry_type": "csv",
                    "activity_date": activity_date,
                }
            )
        except Exception as e:
            print(f"Skipping row: {e}")

    if logs:
        supabase.table("carbon_logs").insert(logs).execute()
    return len(logs)