UPDATE model_plan
SET
    model_name = :model_name,
    abbreviation = :abbreviation,
    status = :status,
    previous_suggested_phase = :previous_suggested_phase,
    archived = :archived,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE model_plan.id = :id
RETURNING
id,
model_name,
abbreviation,
archived,
status,
previous_suggested_phase,
created_by,
created_dts,
modified_by,
modified_dts;
