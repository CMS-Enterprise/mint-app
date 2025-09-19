SELECT 
    link.id,
    link.mto_template_milestone,
    link.mto_template_solution,
    link.template_id,
    link.created_by,
    link.created_dts,
    link.modified_by,
    link.modified_dts
FROM mto_template_milestone_solution_link link
WHERE link.template_id = ANY(:template_ids)
ORDER BY link.created_dts;
