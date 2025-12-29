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
    
    factor = res.data['factor']
    factor_id = res.data['id']
    
    # Calculation: Value * Factor
    co2e_kg = value * factor
    
    return co2e_kg, factor_id