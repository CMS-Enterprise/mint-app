SELECT
    sol.model_plan_id,
    sol.mto_common_solution_key
FROM
    mto_solution AS sol 
WHERE
    sol.mto_common_solution_key = :mto_common_solution_key
