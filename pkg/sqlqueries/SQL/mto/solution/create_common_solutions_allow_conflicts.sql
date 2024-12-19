
data_to_insert AS (
    SELECT 
    GEN_RANDOM_UUID() as id,
    :model_plan_id as model_plan_id,
     UNNEST(CAST(:common_solution_keys AS MTO_COMMON_SOLUTION_KEY[])) AS mto_common_solution_key,
     'NOT_STARTED' as status,
     :created_by AS created_by
),
insert_attempt AS (
    INSERT INTO mto_solution (
        id,
        model_plan_id,
        mto_common_solution_key,
        status,
        created_by
    )
    SELECT id, model_plan_id, mto_common_solution_key, status, created_by
    FROM data_to_insert 
    ON CONFLICT DO NOTHING
    RETURNING
        id,
        model_plan_id,
        mto_common_solution_key,
        name,
        type,
        facilitated_by,
        needed_by,
        status,
        risk_indicator,
        poc_name,
        poc_email,
        created_by,
        created_dts,
        modified_by,
        modified_dts
)
-- Join and return inserted and existing data
SELECT
    mto_solution.id,
    mto_solution.model_plan_id,
    mto_solution.mto_common_solution_key,
    COALESCE(mto_solution.name, mto_common_solution.name) AS "name",
    COALESCE(mto_solution.type, mto_common_solution.type) AS "type",
    mto_solution.facilitated_by,
    mto_solution.needed_by,
    mto_solution.status,
    mto_solution.risk_indicator,
    mto_solution.poc_name,
    mto_solution.poc_email,
    mto_solution.created_by
FROM mto_solution
JOIN data_to_insert on data_to_insert.model_plan_id = mto_solution.model_plan_id AND data_to_insert.mto_common_solution_key = mti_solution.mto_common_solution_key
LEFT JOIN mto_common_solution ON mto_solution.mto_common_solution_key = mto_common_solution.key
WHERE
    mto_solution.model_plan_id = :model_plan_id
    AND mto_solution.mto_common_solution_key = :mto_common_solution_key
