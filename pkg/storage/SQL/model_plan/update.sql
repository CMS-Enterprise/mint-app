UPDATE model_plan
SET
    model_name = :model_name,
    model_abbreviation = :model_abbreviation,
    status = :status,
    archived = :archived,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE model_plan.id = :id
RETURNING
id,
model_name,
model_abbreviation,
archived,
status,
created_by,
created_dts,
modified_by,
modified_dts;
