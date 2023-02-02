SELECT
    id,
    solution_id,
    name,
    status,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM operational_solution_subtask
WHERE id = :id
