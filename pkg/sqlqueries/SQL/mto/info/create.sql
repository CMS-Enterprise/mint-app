INSERT INTO mto_info(
    id,
    ready_for_review_by,
    ready_for_review_dts,
    created_by
)
VALUES (
    :id,
    :ready_for_review_by,
    :ready_for_review_dts,
    :created_by
)
RETURNING
id,
-- for simplicity we return the id again as the model plan id
id AS model_plan_id,
ready_for_review_by,
ready_for_review_dts,
created_by,
created_dts,
modified_by,
modified_dts;
