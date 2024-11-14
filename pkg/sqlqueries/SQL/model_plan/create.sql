INSERT INTO model_plan (
    id,
    model_name,
    abbreviation,
    status,
    created_by,
    modified_by,
    mto_ready_for_review_by,
    mto_ready_for_review_dts

)
VALUES (
    :id,
    :model_name,
    :abbreviation,
    :status,
    :created_by,
    :modified_by,
    :mto_ready_for_review_by,
    :mto_ready_for_review_dts
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
modified_dts,
mto_ready_for_review_by,
mto_ready_for_review_dts;
