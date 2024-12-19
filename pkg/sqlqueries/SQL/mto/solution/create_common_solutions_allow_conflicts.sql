
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
