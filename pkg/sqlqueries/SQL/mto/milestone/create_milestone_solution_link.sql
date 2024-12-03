INSERT INTO mto_milestone_solution_link (
    id,
    milestone_id,
    solution_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts
) VALUES (
    :id,
    :milestone_id,
    :solution_id,
    :created_by,
    :created_dts,
    :modified_by,
    :modified_dts
)
RETURNING
    id,
    milestone_id,
    solution_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
