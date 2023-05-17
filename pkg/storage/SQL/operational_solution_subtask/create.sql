INSERT INTO operational_solution_subtask (
    id,
    solution_id,
    name,
    status,
    created_by,
    modified_by
)
VALUES (
    :id,
    :solution_id,
    :name,
    :status,
    :created_by,
    :modified_by
)
RETURNING
id,
solution_id,
name,
status,
created_by,
created_dts,
modified_by,
modified_dts;
