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
WHERE tm.template_id = ANY(:template_ids)
ORDER BY tm.created_dts;
