from pydantic import BaseModel
from typing import Optional

class EmissionLogCreate(BaseModel):
    dept_id: str
    category: str      # e.g., "Electricity"
    activity: str      # e.g., "Grid"
    value: float       # e.g., 500
    unit: str          # e.g., "kWh"
    entry_type: str = "manual"