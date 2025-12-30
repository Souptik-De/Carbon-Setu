from typing import Optional
from datetime import date

from pydantic import BaseModel


class OrganizationCreate(BaseModel):
    name: str


class BranchCreate(BaseModel):
    org_id: str
    name: str


class DepartmentCreate(BaseModel):
    branch_id: str
    name: str


class EmissionLogCreate(BaseModel):
    dept_id: int  # int8 in database
    category: str  # e.g., "Electricity"
    activity: str  # e.g., "Grid"
    value: float  # e.g., 500
    entry_type: str = "manual"
    activity_date: Optional[date] = None  # Date of the activity, defaults to today if not provided