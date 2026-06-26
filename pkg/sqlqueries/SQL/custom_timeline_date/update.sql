UPDATE custom_timeline_dates
SET
    model_plan_id = :model_plan_id,
    title = :title,
    description = :description,
    date_type = :date_type,
    start_date = :start_date,
    end_date = :end_date,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING
    id,
    model_plan_id,
    title,
    description,
    date_type,
    start_date,
    end_date,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
