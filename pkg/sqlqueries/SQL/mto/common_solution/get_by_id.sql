SELECT
    name,
    key AS "key",
    type,
    subjects,
    filter_view,
    model_plan_id,
    mto_common_milestone_key,
    is_added
FROM
    mto_common_solution
WHERE id = :id;
