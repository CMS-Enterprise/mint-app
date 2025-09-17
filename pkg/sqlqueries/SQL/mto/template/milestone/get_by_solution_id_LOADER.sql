SELECT 
    tm.id,
    tm.template_id,
    tm.mto_common_milestone_key AS key,
    tm.mto_template_category_id,
    tm.created_by,
    tm.created_dts,
    tm.modified_by,
    tm.modified_dts
FROM mto_template_milestone tm
INNER JOIN mto_template_milestone_solution_link link 
    ON tm.id = link.mto_template_milestone
INNER JOIN mto_template_solution ts 
    ON link.mto_template_solution = ts.id
WHERE ts.id = ANY(:solution_ids)
ORDER BY tm.created_dts;
