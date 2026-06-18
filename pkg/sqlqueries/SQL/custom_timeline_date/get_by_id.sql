SELECT
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
    modified_dts
FROM custom_timeline_dates
WHERE id = :id;
