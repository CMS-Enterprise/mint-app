SELECT
    id,
    mto_common_milestone_id,
    mto_common_solution_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM mto_common_milestone_solution_link
WHERE  mto_common_milestone_id = :id;
