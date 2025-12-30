import csv
import random
from datetime import datetime, timedelta

# Configuration
OUTPUT_FILE = "demo_carbon_data_long_term.csv"
START_DATE = datetime.now() - timedelta(days=365)
END_DATE = datetime.now()

# Categories and their typical activities and value ranges
CATEGORIES = {
    "Electricity": [
        ("Grid Consumption (kWh)", 500, 2000),
        ("Server Room Cooling (kWh)", 200, 800)
    ],
    "Transportation": [
        ("Fleet Petrol (Liters)", 50, 300),
        ("Fleet Diesel (Liters)", 100, 500),
        ("Business Travel - Domestic Flights (km)", 500, 2000),
        ("Employee Commute - Car (km)", 100, 1000)
    ],
    "Stationary Combustion": [
        ("Diesel Generator (Liters)", 20, 100),
        ("Natural Gas Heating (m3)", 50, 200)
    ],
    "Purchased Goods": [
        ("Office Paper (Reams)", 10, 50),
        ("IT Equipment (Units)", 1, 10),
        ("Office Furniture (kg)", 50, 200)
    ],
    "Waste": [
        ("Landfill Waste (kg)", 20, 100),
        ("Recycled Paper (kg)", 10, 50),
        ("E-Waste (kg)", 5, 20)
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
            
            # Add some seasonality to Electricity (higher in summer/winter)
            month = current_date.month
            if cat == "Electricity" and (month in [12, 1, 2, 6, 7, 8]):
                base_value *= 1.2
            
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
