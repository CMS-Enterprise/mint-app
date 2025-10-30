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
    cs.key,
    -- Add the milestone ID to populate MTOMilestoneID field
    tm.id AS mto_milestone_id
FROM mto_template_solution ts
INNER JOIN mto_common_solution cs ON ts.mto_common_solution_id = cs.id
INNER JOIN mto_template_milestone_solution_link link 
    ON ts.id = link.mto_template_solution
INNER JOIN mto_template_milestone tm 
    ON link.mto_template_milestone = tm.id
WHERE tm.id = ANY(:milestone_ids)
ORDER BY ts.created_dts;
