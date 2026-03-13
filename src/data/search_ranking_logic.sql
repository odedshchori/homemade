-- SQL Script for Quick Search and Ranking Logic

CREATE OR REPLACE FUNCTION quick_search(search_query TEXT, current_user_id UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    category TEXT,
    default_unit TEXT,
    source TEXT, -- 'pantry' or 'global'
    rank_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH combined_results AS (
        -- 1. Search in User Pantry (Prioritized)
        SELECT 
            i.id, 
            i.name, 
            i.category::TEXT, 
            i.unit::TEXT as default_unit,
            'pantry'::TEXT as source,
            1 as rank_score
        FROM ingredients i
        WHERE i.user_id = current_user_id 
          AND i.name ILIKE '%' || search_query || '%'

        UNION ALL

        -- 2. Search in Global Items
        SELECT 
            gi."Item_ID" as id, 
            gi."Name" as name, 
            gi."Category_ID" as category, 
            gi."Default_Unit" as default_unit,
            'global'::TEXT as source,
            CASE 
                -- If the user has it in their pantry history, rank it higher than other globals
                WHEN EXISTS (SELECT 1 FROM ingredients i2 WHERE i2.user_id = current_user_id AND i2.name = gi."Name") THEN 2
                ELSE 3
            END as rank_score
        FROM "Global_Items" gi
        WHERE gi."Name" ILIKE '%' || search_query || '%'
          -- Avoid duplicates if already in pantry (optional, depending on UX preference)
          AND NOT EXISTS (SELECT 1 FROM ingredients i3 WHERE i3.user_id = current_user_id AND i3.name = gi."Name")
    )
    SELECT * FROM combined_results
    ORDER BY 
        rank_score ASC,
        name ASC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
