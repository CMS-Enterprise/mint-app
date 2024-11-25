UPDATE plan_tdl
SET
    model_plan_id = :model_plan_id,
    id_number = :id_number,
    date_initiated = :date_initiated,
    title = :title,
    note = :note,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    id = :id
RETURNING
    id,
    model_plan_id,
    id_number,
    date_initiated,
    title,
    note,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
