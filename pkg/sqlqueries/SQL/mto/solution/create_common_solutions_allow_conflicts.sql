WITH data_to_insert AS (
    SELECT 
        GEN_RANDOM_UUID() AS id,
        CAST(:model_plan_id AS UUID) AS model_plan_id,
        UNNEST(CAST(:common_solution_keys AS MTO_COMMON_SOLUTION_KEY[])) AS mto_common_solution_key,
        CAST('NOT_STARTED' AS MTO_SOLUTION_STATUS) AS status,
        CAST(:created_by AS UUID) AS created_by
),
insert_attempt AS ( --noqa
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
        modified_dts,
        TRUE AS newly_inserted
),

JOINED AS (
    SELECT
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
        newly_inserted
    FROM insert_attempt
    UNION ALL
    SELECT
        mto_solution.id,
        mto_solution.model_plan_id,
        mto_solution.mto_common_solution_key,
        mto_solution.name,
        mto_solution.type,
        mto_solution.facilitated_by,
        mto_solution.needed_by,
        mto_solution.status,
        mto_solution.risk_indicator,
        mto_solution.poc_name,
        mto_solution.poc_email,
        mto_solution.created_by,
        FALSE AS newly_inserted
    FROM mto_solution
    JOIN data_to_insert ON
        data_to_insert.model_plan_id = mto_solution.model_plan_id
        AND data_to_insert.mto_common_solution_key = mto_solution.mto_common_solution_key
        -- exclude rows that were just inserted (already returned by insert_attempt)
        AND NOT EXISTS (
            SELECT 1 FROM insert_attempt ia
            WHERE
                ia.model_plan_id = mto_solution.model_plan_id
                AND ia.mto_common_solution_key = mto_solution.mto_common_solution_key
        )
)

-- Left Join on common solution for name and type info and return inserted and existing data
SELECT
    JOINED.id,
    JOINED.model_plan_id,
    JOINED.mto_common_solution_key,
    COALESCE(JOINED.name, mto_common_solution.name) AS "name",
    COALESCE(JOINED.type, mto_common_solution.type) AS "type",
    JOINED.facilitated_by,
    JOINED.needed_by,
    JOINED.status,
    JOINED.risk_indicator,
    JOINED.poc_name,
    JOINED.poc_email,
    JOINED.created_by,
    JOINED.newly_inserted
FROM JOINED
JOIN data_to_insert
    ON
        data_to_insert.model_plan_id = JOINED.model_plan_id 
        AND data_to_insert.mto_common_solution_key = JOINED.mto_common_solution_key
LEFT JOIN mto_common_solution ON JOINED.mto_common_solution_key = mto_common_solution.key
