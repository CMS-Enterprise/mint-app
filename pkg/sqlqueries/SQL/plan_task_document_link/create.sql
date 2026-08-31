INSERT INTO plan_task_document_link (
    id,
    plan_task_id,
    plan_document_id,
    created_by
) VALUES (
    :id,
    :plan_task_id,
    :plan_document_id,
    :created_by
)
RETURNING
    id,
    plan_task_id,
    plan_document_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
