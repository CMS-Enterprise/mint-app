SELECT
    id,
    model_name,
    abbreviation,
    archived,
    status,
    previous_suggested_phase,
    created_by,
    created_dts,
    modified_by,
    modified_dts,
    mto_ready_for_review_by,
    mto_ready_for_review_dts
FROM model_plan
WHERE id = :id
