from app.database import supabase

OFFICIAL_FACTORS = [
  
    {"category": "Energy", "activity": "Grid Electricity", "factor": 0.757, "unit": "kWh", "source": "CEA India v20"},
    
    
    {"category": "Transport", "activity": "Petrol (Passenger Car)", "factor": 2.31, "unit": "Litre", "source": "EPA Hub 2025"},
    {"category": "Transport", "activity": "Diesel (Truck/Van)", "factor": 2.68, "unit": "Litre", "source": "EPA Hub 2025"},
    {"category": "Energy", "activity": "Natural Gas", "factor": 2.02, "unit": "m3", "source": "IPCC"},

    
    {"category": "Waste", "activity": "General Landfill", "factor": 450.0, "unit": "Tonne", "source": "DEFRA"},
    {"category": "Waste", "activity": "Paper Recycling", "factor": 21.0, "unit": "Tonne", "source": "DEFRA"},
    {"category": "Water", "activity": "Municipal Water", "factor": 0.344, "unit": "m3", "source": "DEFRA"},
    {"category": "Travel", "activity": "Short-haul Flight", "factor": 0.15, "unit": "km", "source": "ICAO"},
    {"category": "Travel", "activity": "Long-haul Flight", "factor": 0.19, "unit": "km", "source": "ICAO"}
]

def run_seed():
    print(f"Seeding {len(OFFICIAL_FACTORS)} standard factors...")
    try:
        # Using upsert requires a unique constraint on (category, activity) in Supabase
        supabase.table("emission_factors").upsert(OFFICIAL_FACTORS, on_conflict="category,activity").execute()
        print("Seeding successful.")
    except Exception as e:
        print(f"Error seeding: {e}")

if __name__ == "__main__":
    run_seed()