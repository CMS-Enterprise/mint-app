DELETE FROM custom_timeline_date
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
