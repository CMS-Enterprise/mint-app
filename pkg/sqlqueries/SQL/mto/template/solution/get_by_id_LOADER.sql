SELECT 
    ts.id,
    ts.template_id,
    ts.mto_common_solution_id,
    ts.created_by,
    ts.created_dts,
    ts.modified_by,
    ts.modified_dts,
    -- Get the name and key from the common solution
    cs.name,
    cs.key
FROM mto_template_solution ts
INNER JOIN mto_common_solution cs ON ts.mto_common_solution_id = cs.id
WHERE ts.id = ANY(:ids)
ORDER BY ts.created_dts;
