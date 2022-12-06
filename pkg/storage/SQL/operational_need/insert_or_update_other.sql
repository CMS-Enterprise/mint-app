INSERT INTO operational_need(
    id,
    model_plan_id,
    name_other,
    needed,
    created_by,
    created_dts
)
SELECT
    :id AS id,
    :model_plan_id AS model_plan_id,
    :name_other AS name_other,
    :needed AS needed,
    :created_by AS created_by,
    CURRENT_TIMESTAMP AS created_dts

ON CONFLICT(model_plan_id, name_other) DO -- If there is already a record for this, 
UPDATE
SET
needed = EXCLUDED.needed,
modified_by = :modified_by,
modified_dts = CURRENT_TIMESTAMP
RETURNING
id,
model_plan_id,
need_type,
NULL AS need_name,
NULL AS need_key,
name_other,
needed,
created_by,
created_dts,
modified_by,
modified_dts;
