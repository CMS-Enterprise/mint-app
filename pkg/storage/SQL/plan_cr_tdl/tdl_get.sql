SELECT
    id,
    model_plan_id,
    id_number,
    date_initiated,
    title,
    note,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM plan_cr_tdl
WHERE id = :id
AND type = 'TDL';
