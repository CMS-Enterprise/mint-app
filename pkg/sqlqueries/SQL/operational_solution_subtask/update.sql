UPDATE operational_solution_subtask
SET
    name = :name,
    status = :status,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING
    id,
    solution_id,
    name,
    status,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
