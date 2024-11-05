SELECT
    mto_common_milestone_key,
    mto_common_solution_key
FROM mto_common_milestone_solution_link
WHERE  mto_common_milestone_key = :mto_common_milestone_key;
