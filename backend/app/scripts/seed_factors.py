from app.database import supabase

# Based on your uploaded 'Results.csv' (Combined Margin 2023-24)
# and 'GHG Hub 2025'
OFFICIAL_FACTORS = [
    {
        "category": "Electricity", 
        "activity": "Grid", 
        "factor": 0.757, 
        "unit": "kWh", 
        "source": "CEA India v20"
    },
    {
        "category": "Transport", 
        "activity": "Petrol", 
        "factor": 2.31, 
        "unit": "Litre", 
        "source": "EPA Hub 2025"
    },
    {
        "category": "Transport", 
        "activity": "Diesel", 
        "factor": 2.68, 
        "unit": "Litre", 
        "source": "EPA Hub 2025"
    }
]

def run_seed():
    print("Seeding standard factors...")
    supabase.table("emission_factors").upsert(OFFICIAL_FACTORS).execute()
    print("Done.")

if __name__ == "__main__":
    run_seed()