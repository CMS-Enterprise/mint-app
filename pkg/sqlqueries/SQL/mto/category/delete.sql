DELETE FROM mto_category
WHERE id = :id
RETURNING
    id,
    name,
    parent_id,
    model_plan_id,
    position,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
