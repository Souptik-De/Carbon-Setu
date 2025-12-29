from app.database import supabase

def calculate_co2e(category: str, activity: str, value: float):
    # Fetch the standard factor from our seeded table
    res = supabase.table("emission_factors") \
        .select("id, factor") \
        .eq("category", category) \
        .eq("activity", activity) \
        .single().execute()
    
    if not res.data:
        raise ValueError(f"No factor found for {category} - {activity}")
    
    factor = float(res.data['factor'])
    factor_id = int(res.data['id'])  # Ensure this is an int for int8
    
    # Calculation: Value * Factor
    co2e_kg = float(value * factor)  # Explicit float conversion
    
    return co2e_kg, factor_id