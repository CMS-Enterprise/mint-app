DELETE FROM existing_model_link
WHERE id = :id
RETURNING
    id,
    model_plan_id,
    existing_model_id,
    current_model_plan_id,
    field_name,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
