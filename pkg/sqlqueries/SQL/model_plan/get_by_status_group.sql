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
    modified_dts
FROM model_plan
WHERE model_plan.archived is FALSE AND status IN (:statuses);
            