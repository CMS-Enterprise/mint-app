UPDATE custom_timeline_dates AS ctd
SET
    start_date = COALESCE(updates.start_date, ctd.start_date),
    end_date = updates.end_date,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
FROM
    UNNEST(
        CAST(:ids AS UUID[]),
        CAST(:start_dates AS TIMESTAMPTZ[]),
        CAST(:end_dates AS TIMESTAMPTZ[])
    ) AS updates(id, start_date, end_date)
WHERE ctd.id = updates.id
RETURNING
    ctd.id,
    ctd.model_plan_id,
    ctd.title,
    ctd.description,
    ctd.date_type,
    ctd.start_date,
    ctd.end_date,
    ctd.created_by,
    ctd.created_dts,
    ctd.modified_by,
    ctd.modified_dts;
