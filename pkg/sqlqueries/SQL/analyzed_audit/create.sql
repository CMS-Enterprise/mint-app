INSERT INTO analyzed_audit (
    id,
    model_plan_id,
    model_name,
    date,
    changes,
    created_by,
    modified_by
)
VALUES (
    :id,
    :model_plan_id,
    :model_name,
    :date,
    :changes,
    :created_by,
    :modified_by
)
RETURNING
    id,
    model_plan_id,
    model_name,
    date,
    changes,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
