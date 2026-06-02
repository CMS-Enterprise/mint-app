INSERT INTO ctat_request_model_plan_link (
    id,
    model_plan_id,
    ctat_request_id,
    created_by,
    modified_by
)
VALUES (
    :id,
    :model_plan_id,
    :ctat_request_id,
    :created_by,
    :modified_by
)
RETURNING *;
