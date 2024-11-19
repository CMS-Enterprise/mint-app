INSERT INTO mto_info(
    id,
    model_plan_id,
    ready_for_review_by,
    ready_for_review_dts,
    created_by
)
VALUES (
    :id,
    :model_plan_id,
    :ready_for_review_by,
    :ready_for_review_dts,
    :created_by
)
RETURNING
id,
model_plan_id,
ready_for_review_by,
ready_for_review_dts,
created_by,
created_dts,
modified_by,
modified_dts;
