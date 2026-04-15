INSERT INTO mto_common_milestone_solution_link (
    mto_common_milestone_id,
    mto_common_solution_key
)
SELECT
    :id AS id,
    solution_keys.mto_common_solution_key
FROM (
    SELECT DISTINCT
        mto_common_solution_key
    FROM UNNEST(CAST(:mto_common_solution_keys AS MTO_COMMON_SOLUTION_KEY[])) AS keys(mto_common_solution_key)
) solution_keys;
