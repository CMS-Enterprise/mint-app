SELECT 
    ts.id,
    ts.template_id,
    ts.mto_common_solution_id,
    ts.created_by,
    ts.created_dts,
    ts.modified_by,
    ts.modified_dts
FROM mto_template_solution ts
WHERE ts.template_id = ANY(:template_ids)
ORDER BY ts.created_dts;
