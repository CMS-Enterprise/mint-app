SELECT 
    tc.id,
    tc.template_id,
    tc.name,
    tc.parent_id,
    tc."order",
    tc.created_by,
    tc.created_dts,
    tc.modified_by,
    tc.modified_dts
FROM mto_template_category tc
WHERE
    tc.template_id = ANY(:template_ids)
    AND parent_id IS NULL
ORDER BY tc."order", tc.created_dts;
