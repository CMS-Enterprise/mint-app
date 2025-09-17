SELECT 
    t.id,
    t.key,
    t.name,
    t.description,
    t.created_by,
    t.created_dts,
    t.modified_by,
    t.modified_dts,
    -- Convenience counts
    COALESCE(cat_counts.category_count, 0) AS category_count,
    COALESCE(cat_counts.primary_category_count, 0) AS primary_category_count,
    COALESCE(mil_counts.milestone_count, 0) AS milestone_count,
    COALESCE(sol_counts.solution_count, 0) AS solution_count,
    -- Default values for isAdded and dateAdded since this is get by ID
    FALSE AS is_added,
    NULL::TIMESTAMP WITH TIME ZONE AS date_added
FROM mto_template t
LEFT JOIN (
    -- Count categories and primary categories (parent_id IS NULL)
    SELECT 
        template_id,
        COUNT(*) AS category_count,
        COUNT(*) FILTER (WHERE parent_id IS NULL) AS primary_category_count
    FROM mto_template_category
    GROUP BY template_id
) cat_counts ON t.id = cat_counts.template_id
LEFT JOIN (
    -- Count milestones
    SELECT 
        template_id,
        COUNT(*) AS milestone_count
    FROM mto_template_milestone
    GROUP BY template_id
) mil_counts ON t.id = mil_counts.template_id
LEFT JOIN (
    -- Count solutions
    SELECT 
        template_id,
        COUNT(*) AS solution_count
    FROM mto_template_solution
    GROUP BY template_id
) sol_counts ON t.id = sol_counts.template_id
WHERE t.id = ANY(:ids)
ORDER BY t.name;
