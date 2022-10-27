INSERT INTO analyzed_model_change (
    id,
    model_plan_id,
    date,
    changes,
    created_by,
    modified_by,
)
VALUES (
    :id,
    :model_plan_id,
    :date,
    :changes,
    :created_by,
    :modified_by
)
RETURNING
id,
model_plan_id,
date,
changes,
created_by,
created_dts,
modified_by,
modified_dts;
