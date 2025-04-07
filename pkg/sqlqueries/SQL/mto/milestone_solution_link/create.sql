INSERT INTO mto_milestone_solution_link (
    id,
    milestone_id,
    solution_id,
    created_by
) VALUES (
    :id,
    :milestone_id,
    :solution_id,
    :created_by
)
RETURNING
    id,
    milestone_id,
    solution_id,
    created_by;
