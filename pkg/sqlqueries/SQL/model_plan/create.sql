INSERT INTO model_plan (
    id,
    model_name,
    abbreviation,
    status,
    created_by,
    modified_by
)
VALUES (
    :id,
    :model_name,
    :abbreviation,
    :status,
    :created_by,
    :modified_by
)
RETURNING
id,
model_name,
abbreviation,
status,
archived,
created_by,
created_dts,
modified_by,
modified_dts;
