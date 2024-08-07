SELECT
    id,
    model_name,
    abbreviation,
    status,
    previous_suggested_phase,
    archived,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM model_plan
WHERE archived = :archived
