import csv
import random
from datetime import datetime, timedelta

# Configuration
OUTPUT_FILE = "demo_carbon_data_long_term.csv"
START_DATE = datetime.now() - timedelta(days=365)
END_DATE = datetime.now()

# Categories and their typical activities and value ranges
# Categories and their typical activities and value ranges (Min, Max) based on backend/app/scripts/seed_factors.py
CATEGORIES = {
    "Energy": [
        ("Grid Electricity", 200, 5000), # kWh
        ("Natural Gas", 50, 1000)        # m3
    ],
    "Transport": [
        ("Petrol (Passenger Car)", 20, 150), # Litre
        ("Diesel (Truck/Van)", 50, 300)      # Litre
    ],
    "Waste": [
        ("General Landfill", 0.1, 2.0),      # Tonne
        ("Paper Recycling", 0.05, 0.5)       # Tonne
    ],
    "Water": [
        ("Municipal Water", 10, 100)         # m3
    ],
    "Travel": [
        ("Short-haul Flight", 300, 1500),    # km
        ("Long-haul Flight", 3000, 12000)    # km
    ]
}

def generate_data():
    data = []
    current_date = START_DATE
    
    # Generate data for roughly every 2-3 days over the year
    while current_date <= END_DATE:
        # Pick 2-4 random categories to log for this day
        daily_categories = random.sample(list(CATEGORIES.keys()), k=random.randint(2, 4))
        
        for cat in daily_categories:
            activities = CATEGORIES[cat]
            # Pick 1 random activity from the category
            activity_name, min_val, max_val = random.choice(activities)
            
            # Generate a random value with some seasonality/variance
            base_value = random.uniform(min_val, max_val)
            
            # Add some seasonality to Energy (higher in summer/winter for AC/Heating)
            month = current_date.month
            if cat == "Energy" and (month in [12, 1, 2, 6, 7, 8]):
                base_value *= 1.3
            
            # Add randomness
            value = round(base_value * random.uniform(0.9, 1.1), 2)
            
            data.append({
                "activity_date": current_date.strftime("%Y-%m-%d"),
                "category": cat,
                "activity": activity_name,
                "value": value
            })
        
        # Advance by 1-3 days
        current_date += timedelta(days=random.randint(1, 3))
        
    return data

def main():
    print(f"Generating data from {START_DATE.date()} to {END_DATE.date()}...")
    rows = generate_data()
    
    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=["activity_date", "category", "activity", "value"])
        writer.writeheader()
        writer.writerows(rows)
        
    print(f"Successfully created {OUTPUT_FILE} with {len(rows)} rows.")

if __name__ == "__main__":
    main()
