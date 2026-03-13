# Track 8: Database Seed Generation (Global Catalog)

## Goal
Generate the initial payload to populate the Global_Items table so users have immediate access to standard items.

## Instructions
"Act as a database architect. Generate a JSON array representing the 100 most common ingredients found in a standard residential kitchen. Adhere strictly to this schema: Item_ID (UUID), Name (Standardized string, e.g., 'Cucumber'), Category_ID (Choose from: Vegetables, Fruits, Dairy, Meat/Fish, Grains & Legumes, Spices, Canned Goods), Default_Unit (Grams, Units, or ml), and Expiry_Buffer (Integer representing average shelf life in days). Return ONLY valid JSON. Everything should be in hebrew"

## Tasks
1. [x] Generate the 100-item JSON seed data. 37200dd
2. [x] Validate the JSON structure against the required schema. 37200dd
3. [~] Prepare a SQL migration or script to import the data into Supabase.

## Verification
- Data is in valid JSON format.
- All items follow the schema strictly.
- Data can be successfully imported into the Global_Items table.
