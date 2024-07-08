UPDATE model_plan
SET
    model_name = :model_name,
    abbreviation = :abbreviation,
    status = :status,
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
created_by,
created_dts,
modified_by,
modified_dts;
