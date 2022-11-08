INSERT INTO plan_document_solution_link (
    id,
    solution_id,
    document_id,
    created_by,
    modified_by
)
VALUES (
    :id,
    :solution_id,
    :document_id,
    :created_by,
    :modified_by
)
RETURNING
id,
solution_id,
document_id,
created_by,
created_dts,
modified_by,
modified_dts
